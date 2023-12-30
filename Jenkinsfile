pipeline {
    agent any

    stages {
        stage('Run') {
            steps {
                // Pull and run Docker container for backend from Docker Hub
                sh 'docker run -p 8080:8080 khaleddkassab/clinic:BACK-ENDDDD'
                // Replace 'khaleddkassab/clinic:BACK-ENDDDD' with your actual Docker Hub image name and tag
            }
        }
    }
}
