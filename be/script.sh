# Kết nối với Docker daemon của Minikube
eval $(minikube docker-env)

# Build image
docker build  --no-cache -t express-backend:v1 .

# Triển khai các file YAML theo đúng thứ tự
echo -e "\n----------------------------------apply----------------------------------------"
kubectl apply -f backend-deployment.yaml
# kubectl apply -f haproxy-configmap.yaml
# kubectl apply -f haproxy-deployment.yaml

# Kiểm tra image đã được tạo
echo -e "\n-------------------------------------check image------------------------------------------"
docker images | grep -E "express-backend|haproxy"

# Kiểm tra pods
echo -e "\n-------------------------------------get pods------------------------------------------"
kubectl get pods

# Kiểm tra services
echo -e "\n----------------------------------------check service----------------------------------------"
kubectl get services

# Kiểm tra deployments
echo  -e "\n--------------------------------------------check deployment-----------------------------------"
kubectl get deployments

# Kiểm tra ip của node
echo  -e "\n--------------------------------------------check nodeIP-----------------------------------"
kubectl get service express-backend-service

# Kiểm tra port được release
echo  -e "\n--------------------------------------------check port release-----------------------------------"
kubectl get nodes -o wide