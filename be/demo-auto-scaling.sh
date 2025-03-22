#!/bin/bash
DEPLOYMENT_NAME="express-backend"

# Lặp vô hạn
while true; do
  CURRENT_SECONDS=$(date +%S)
  CURRENT_SECONDS_DECIMAL=$((10#$CURRENT_SECONDS)) 
  
  NUM_PODS=$((CURRENT_SECONDS_DECIMAL % 10))
  
  if [ $NUM_PODS -eq 0 ]; then
    NUM_PODS=1
  fi
  
  echo "$(date) - Giây hiện tại ($CURRENT_SECONDS), giây % 10 = $((CURRENT_SECONDS_DECIMAL % 10)). Đặt số pod = $NUM_PODS"
  kubectl scale deployment $DEPLOYMENT_NAME --replicas=$NUM_PODS
  
  sleep 2
  echo "Danh sách pod đang hoạt động:"
  kubectl get pods -l app=express-backend --no-headers | grep -v "Terminating" | awk '{print $1 " - " $3}'
  echo "-----------------------------------------------------"
done