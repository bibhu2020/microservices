# login into ACR first
#az login
az account set --subscription 433cb7d3-bac1-4059-bacf-afb085b7a62b
az acr login --name aksocstgacr

docker build -t onecloud-monitoringapi:v1.0 -f ./_monitoring/monitoringapi/Dockerfile ./_monitoring/monitoringapi/ \
  && docker tag onecloud-monitoringapi:v1.0 aksocstgacr.azurecr.io/onecloud-monitoringapi:v1.0 \
  && docker push aksocstgacr.azurecr.io/onecloud-monitoringapi:v1.0

docker build -t onecloud-monitoringapp:v1.0 -f ./_monitoring/monitoringapp/Dockerfile ./_monitoring/monitoringapp/

###Deployments
helm upgrade --install monitoringapi -n monitoring ./_monitoring/monitoringapi/helm-monitoringapi/ \
    --set   application.namespace=monitoring \
    --set   application.name=monitoringapi \
    --set   application.hostHeader=riskiq.cloudblogsaksstg.microsoft.com \
    --set   application.image.repository="aksocdevacr.azurecr.io/riskiq-stage" \
    --set   application.image.tag="43762" \
    --set   application.secrets.secretLoaderImage="aksocdevacr.azurecr.io/onecloud-health-probe:v1" \
    --set   application.secrets.secretRefName="aksoc-dev-riskiq-kv" \
    --set   application.secrets.secretProviderClass="aksoc-dev-riskiq-kv" \
    --set   application.storages.mediaStore.persistentVolumeClaim="aksocdeveastusmedia-riskiq" \
    --set   application.storages.mediaStore.secretProviderClass="aksocdeveastusmedia-aksoc-dev-eastus-kv1" \
    --set   application.storages.logStore.persistentVolumeClaim="aksocdeveastuslogs-riskiq" \
    --set   application.storages.logStore.secretProviderClass="aksocdeveastuslogs-aksoc-dev-eastus-kv1" \
    --set   application.storages.backupStore.persistentVolumeClaim="aksocdeveastusbackups-riskiq" \
    --set   application.storages.backupStore.secretProviderClass="aksocdeveastusbackups-aksoc-dev-eastus-kv1" \
    --set   application.databases.mysql.inClusterDb=false \
    --set   application.databases.mysql.host="aksoc-dev-eastus-riskiq-sql.mysql.database.azure.com" \
    --set   application.databases.mysql.image="aksocdevacr.azurecr.io/mysql:8.0" \
    --set   application.databases.mysql.xtrabackupImage="aksocdevacr.azurecr.io/xtrabackup:1.0" \
    --set   application.resources.primaryResourceGroup="aksoc-dev-eastus-riskiq-rg" \
    --set   application.resources.primaryLocation="eastus" \
    --set   application.cronJobs.dbBackup.enabled=true \
    --set   application.cronJobs.dbBackup.image="aksocdevacr.azurecr.io/onecloud-mysql-client:v1" \
    --set   application.cronJobs.dbBackup.dbServer="riskiq-dbhost" \
    --set   service.type=ClusterIP \
    --set   service.port=80 \
    --set   autoscaling.enabled=true \
    --set   autoscaling.minReplicas=2 \
    --set   autoscaling.maxReplicas=4 \
    --set   autoscaling.targetCPUUtilizationPercentage=80 \
    --set   autoscaling.targetMemoryUtilizationPercentage=80 
