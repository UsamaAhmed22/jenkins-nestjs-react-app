pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    
    environment {
        SERVER_IP = '172.27.3.80'
        DEPLOY_USER = 'deploy-user'
        BACKEND_DIR = '/var/www/backend'
        FRONTEND_DIR = '/var/www/frontend'
        BACKUP_DIR = '/var/backups/deployments'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/UsamaAhmed22/jenkins-nestjs-react-app.git'
            }
        }
        
        stage('Setup Tools') {
            steps {
                sh 'npm install -g typescript'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                    sh 'npx tsc'  // Use npx instead of direct tsc
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm test'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(
                        credentialsId: 'deployment-server',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )]) {
                        sh """
                            echo "Testing SSH connection first..."
                            ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=5 $SSH_USER@$SERVER_IP "echo 'SSH connection successful'"
                            
                            echo "Deploying applications..."
                            // Add your deployment commands here
                        """
                    }
                }
            }
        }
    }
    
    post {
        failure {
            echo "Pipeline failed - check TypeScript installation and SSH credentials"
        }
    }
}
