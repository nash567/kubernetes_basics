docker build -t bipen2001/multi-client:latest -t bipen2001/multi-client:${{github.sha}} -f ./client/Dockerfile ./client
docker build -t bipen2001/multi-server:latest -t bipen2001/multi-server:${{github.sha}} -f ./server/Dockerfile ./server
docker build -t bipen2001/multi-worker:latest -t bipen2001/multi-worker:${{github.sha}} -f ./worker/Dockerfile ./worker
docker push bipen2001/multi-client:latest
docker push bipen2001/multi-client:${{github.sha}}
docker push bipen2001/multi-server:latest
docker push bipen2001/multi-server:${{github.sha}}
docker push bipen2001/multi-worker:latest
docker push bipen2001/multi-worker:${{github.sha}}
kubectl apply -f k8s
kubectl set image deployments/server-deployment server=bipen/multi-server:${{github.sha}}
kubectl set image deployments/client-deployment server=bipen/multi-client:${{github.sha}}
kubectl set image deployments/worker-deployment server=bipen/multi-worker:${{github.sha}}

