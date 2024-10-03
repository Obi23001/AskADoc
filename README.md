# AskADoc

AskADoc est une plateforme de consultation médicale qui connecte les patients avec des professionnels de santé. L'application se compose d'un service backend construit avec Spring Boot et d'une application frontend développée avec Angular.

## Structure du projet

Le projet est divisé en deux parties principales :

- **Backend** : Situé dans le répertoire `AskADoc/Backend`, cette partie gère la logique côté serveur, y compris les points d'API, les interactions avec la base de données et les configurations de sécurité.
- **Frontend** : Situé dans le répertoire `AskADoc/MedicalConsultation_Front`, cette partie fournit l'interface utilisateur permettant aux patients et aux médecins d'interagir avec le système.

## Technologies utilisées

### Backend :
- Angular (Port : 4200)
- Spring Boot
- Base de données : MySQL (phpMyAdmin Port : 3306)
- Java Spring Boot
- Maven
- Spring Security

### Frontend :
- Angular
- TypeScript
- Tailwind CSS
- Bootstrap

## Prérequis
- Java 17 ou supérieur
- Node.js et npm
- Maven

## Configuration du backend

1. Accédez au répertoire backend :

    ```bash
    cd AskADoc/Backend
    ```

2. Construisez le projet avec Maven :

    ```bash
    ./mvnw clean install
    ```

3. Exécutez l'application :

    ```bash
    ./mvnw spring-boot:run
    ```

Le backend sera disponible à `http://localhost:8088/api/v1`.

## Configuration du frontend

1. Accédez au répertoire frontend :

    ```bash
    cd AskADoc/MedicalConsultation_Front/MedicalFront
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

3. Démarrez le serveur de développement :

    ```bash
    npm start
    ```

Le frontend sera disponible à `http://localhost:4200`.

## Configuration de Maildev (pour tester les emails)

1. Installez Maildev globalement via npm :

    ```bash
    npm install -g maildev
    ```

2. Démarrez Maildev en exécutant la commande suivante :

    ```bash
    maildev
    ```

3. Maildev démarre un serveur SMTP sur le port `1025` et une interface web sur le port `1080`.

    - **Serveur SMTP** : `localhost`
    - **Port SMTP** : `1025`

4. Configurez l'application backend pour utiliser ce serveur SMTP local en ajustant les propriétés d'email dans les fichiers de configuration de Spring Boot (ex. `application.properties` ou `application.yml`).

    ```properties
    spring.mail.host=localhost
    spring.mail.port=1025
    ```

5. Vous pouvez visualiser les emails envoyés par l'application en accédant à l'interface web de Maildev à l'adresse suivante :

    ```
    http://localhost:1080
    ```

---

Cela vous permettra de tester et de vérifier les emails envoyés depuis votre plateforme AskADoc dans un environnement de développement.
