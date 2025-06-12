#!/bin/bash

DURATION=$(</dev/stdin)
if (($DURATION <= 9000 )); then
    exit 60
else
 set -e
 
 b_host="bitcoind.embassy"
 b_username=$(yq '.user' /data/start9/config.yaml)
 b_password=$(yq '.password' /data/start9/config.yaml)
 
 #Get blockchain info from the bitcoin rpc
 b_gbc_result=$(curl -sS --user $b_username:$b_password --data-binary '{"jsonrpc": "1.0", "id": "sync-hck", "method": "getblockchaininfo", "params": []}' -H 'content-type: text/plain;' http://$b_host:8332/ 2>&1)
 error_code=$?
 b_gbc_error=$(echo $b_gbc_result | yq '.error' -)
 if [[ $error_code -ne 0 ]]; then
    echo "Error contacting Bitcoin RPC: $b_gbc_result" >&2
    exit 61
 elif [ "$b_gbc_error" != "null" ] ; then
    #curl returned ok, but the "good" result could be an error like:
    # '{"result":null,"error":{"code":-28,"message":"Verifying blocks…"},"id":"sync-hck"}'
    # meaning bitcoin is not yet synced.  Display that "message" and exit:
    echo "Bitcoin RPC returned error: $b_gbc_error" >&2
    exit 61
 fi

 b_block_count=$(echo "$b_gbc_result" | yq '.result.blocks' -)
 b_block_ibd=$(echo "$b_gbc_result" | yq '.result.initialblockdownload' -)
 if [ "$b_block_count" = "null" ]; then
    echo "Error ascertaining Bitcoin blockchain status: $b_gbc_error" >&2
    exit 61
 elif [ "$b_block_ibd" != "false" ] ; then
    b_block_hcount=$(echo "$b_gbc_result" | yq '.result.headers' -)
    echo -n "Bitcoin blockchain is not fully synced yet: $b_block_count of $b_block_hcount blocks" >&2
    echo " ($(expr ${b_block_count}00 / $b_block_hcount)%)" >&2
    exit 61
 else
    #Gather keys/values from prometheus rpc:
    curl_res=$(curl -sS localhost:4224)
    error_code=$?
    
    if [[ $error_code -ne 0 ]]; then
        echo "Error contacting the electrs Prometheus RPC" >&2
        exit 61
    fi
    
    #Determine whether we are actively doing a database compaction:
    #compaction_res=$(echo -e "$features_res" | grep num-running-compactions | sed "s/\s$//g" | grep " [^0]$"|awk '{print $NF}'|head -1)
    #^The prometheus RPC's num-running-compactions key doesn't seem to correspond to actual
    # compaction events, so we'll determine compaction by another, dumber but accurate method:
    chk_numlines=100000 #Look through the last 100,000 lines of the db LOG
    log_file="/data/db/bitcoin/LOG"
    tail_log="tail -$chk_numlines $log_file"
    compaction_job=$($tail_log|grep EVENT_LOG|grep "ManualCompaction"|tail -1|cut -d" " -f7)
    if [ -n "$compaction_job" ] ; then
        compaction_job_is_done=$($tail_log|grep "\"job\": $compaction_job \"event\": \"compaction_finished\""|wc -l)
        if [[ $compaction_job_is_done -eq 0 ]] ; then
            echo "Finishing database compaction... This could take some hours depending on your hardware." >&2
            exit 61
        fi
    fi
    synced_height=$(echo -e "$curl_res" | grep index_height | grep tip | awk '{ print $NF }')
    if [ -n "$synced_height" ] && [[ $synced_height -ge 0 ]] ; then
        if [[ $synced_height -lt $b_block_count ]] ; then
            echo "Catching up to blocks from bitcoind. This should take at most a day. Progress: $synced_height of $b_block_count blocks ($(expr ${synced_height}00 / $b_block_count)%)" >&2
            exit 61
        else
            #Check to make sure the electrs RPC is actually up and responding
            features_res=$(echo '{"jsonrpc": "2.0", "method": "server.features", "params": ["", "1.4"], "id": 0}' | netcat -w 1 127.0.0.1 50001)
            server_string=$(echo "$features_res" | yq '.result.server_version')
            if [ -n "$server_string" ] ; then
                #Index is synced to tip
                exit 0
            else
                echo "electrs RPC is not responding." >&2
                exit 61
            fi
        fi
    elif [ -z "$synced_height" ] ; then
        echo "The electrs Prometheus RPC is not yet returning the sync status" >&2
        exit 61
    fi
 fi
fi