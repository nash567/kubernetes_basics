docker build -t bipen2001/multi-client:latest -t bipen2001/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t bipen2001/multi-server:latest -t bipen2001/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t bipen2001/multi-worker:latest -t bipen2001/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push bipen2001/multi-client:latest
docker push bipen2001/multi-client:$SHA
docker push bipen2001/multi-server:latest
docker push bipen2001/multi-server:$SHA
docker push bipen2001/multi-worker:latest
docker push bipen2001/multi-worker:$SHA
kubectl apply -f ./k8s
kubectl set image deployments/server-deployment server=bipen/multi-server:$SHA
kubectl set image deployments/client-deployment client=bipen/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=bipen/multi-worker:$SHA

