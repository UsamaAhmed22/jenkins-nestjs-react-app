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
                sh 'npm install -g typescript webpack webpack-cli'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                    sh 'npx tsc'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm test'
                    sh 'npx webpack --mode production'  // Use npx instead of direct webpack
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "Deployment would happen here if build succeeded"
                    // Add your deployment commands here once build works
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed - check build logs"
        }
    }
}
