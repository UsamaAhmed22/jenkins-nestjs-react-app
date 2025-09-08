pipeline {
    agent any
    tools {
        nodejs 'nodejs' // Make sure this is configured in Jenkins
    }
    
    environment {
    SERVER_IP = '172.27.3.80'  // Your actual server IP
    DEPLOY_USER = 'deploy-user'
    BACKEND_DIR = '/var/www/backend'
    FRONTEND_DIR = '/var/www/frontend'
    BACKUP_DIR = '/var/backups/deployments'
}
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/UsamaAhmed22/jenkins-nestjs-react-app.git' // Update with your repo
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                    sh 'npm run build'
                    stash includes: 'dist/**', name: 'backend-build'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm test'
                    sh 'npm run build'
                    stash includes: 'build/**', name: 'frontend-build'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    try {
                        echo "Creating backup..."
                        sh """
                            ssh ${DEPLOY_USER}@${SERVER_IP} \
                            "mkdir -p ${BACKUP_DIR} && \
                            tar -czf ${BACKUP_DIR}/backup-\$(date +%Y%m%d%H%M%S).tar.gz \
                            ${BACKEND_DIR} ${FRONTEND_DIR} 2>/dev/null || true"
                        """
                        
                        echo "Deploying Backend..."
                        unstash 'backend-build'
                        sh """
                            ssh ${DEPLOY_USER}@${SERVER_IP} "mkdir -p ${BACKEND_DIR}"
                            scp -r backend/dist/* ${DEPLOY_USER}@${SERVER_IP}:${BACKEND_DIR}/
                            ssh ${DEPLOY_USER}@${SERVER_IP} \
                            "cd ${BACKEND_DIR} && npm install --production && pm2 restart backend-app || pm2 start dist/main.js --name backend-app"
                        """
                        
                        echo "Deploying Frontend..."
                        unstash 'frontend-build'
                        sh """
                            ssh ${DEPLOY_USER}@${SERVER_IP} "mkdir -p ${FRONTEND_DIR}"
                            scp -r frontend/build/* ${DEPLOY_USER}@${SERVER_IP}:${FRONTEND_DIR}/
                            ssh ${DEPLOY_USER}@${SERVER_IP} "nginx -s reload || echo 'Nginx reload failed'"
                        """
                        
                        echo "Deployment completed successfully!"
                    } catch (error) {
                        currentBuild.result = 'FAILURE'
                        error "Deployment failed: ${error}"
                    }
                }
            }
        }
    }
    
    post {
        failure {
            script {
                echo "Starting rollback..."
                sh """
                    LATEST_BACKUP=\$(ssh ${DEPLOY_USER}@${SERVER_IP} \
                    "ls -t ${BACKUP_DIR}/*.tar.gz | head -1 2>/dev/null || echo ''")
                    
                    if [ ! -z "\$LATEST_BACKUP" ]; then
                        ssh ${DEPLOY_USER}@${SERVER_IP} \
                        "tar -xzf \$LATEST_BACKUP -C / && \
                        cd ${BACKEND_DIR} && npm install --production && \
                        pm2 restart backend-app && \
                        nginx -s reload || echo 'Rollback completed with warnings'"
                        echo "Rollback completed successfully!"
                    else
                        echo "No backup found for rollback!"
                    fi
                """
            }
        }
        
        always {
            echo "Pipeline execution completed - ${currentBuild.result}"
        }
    }
}
