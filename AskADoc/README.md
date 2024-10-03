AskADoc est une plateforme de consultation médicale qui connecte les patients avec des professionnels de santé. L'application se compose d'un service backend construit avec Spring Boot et d'une application frontend développée avec Angular.

Structure du projet Le projet est divisé en deux parties principales :

Backend : Situé dans le répertoire AskADoc/Backend, cette partie gère la logique côté serveur, y compris les points d'API, les interactions avec la base de données et les configurations de sécurité. Frontend : Situé dans le répertoire Front/MedicalConsultation_Front, cette partie fournit l'interface utilisateur permettant aux patients et aux médecins d'interagir avec le système. Technologies utilisées Backend :

Frontend : Angular (Port : 4200) Backend : Spring Boot Base de données : MySQL (phpMyAdmin Port : 3306)

Java Spring Boot Maven Spring Security

Frontend :

Angular TypeScript Tailwind CSS Bootstrap Pour commencer Prérequis Java 17 ou supérieur Node.js et npm Maven Configuration du backend

Accédez au répertoire backend :

cd AskADoc/Backend

Construisez le projet avec Maven :

./mvnw clean install

Exécutez l'application :

./mvnw spring-boot

Le backend sera disponible à http://localhost:8088/api/v1.

Configuration du frontend Accédez au répertoire frontend :

cd Front/MedicalConsultation_Front/MedicalFront

Installez les dépendances :

npm install

Démarrez le serveur de développement :

npm start

Le frontend sera disponible à http://localhost:4200.
