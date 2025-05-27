// Script d'initialisation MongoDB pour Docker
// Ce script sera exécuté au premier démarrage de MongoDB

// Créer la base de données WebKlor
db = db.getSiblingDB('webklor');

// Créer les collections avec validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password", "role"],
      properties: {
        username: {
          bsonType: "string",
          description: "Username is required and must be a string"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email must be a valid email address"
        },
        password: {
          bsonType: "string",
          description: "Password is required and must be a string"
        },
        role: {
          enum: ["admin", "user"],
          description: "Role must be either admin or user"
        }
      }
    }
  }
});

db.createCollection('posts');
db.createCollection('comments');
db.createCollection('messages');
db.createCollection('newsletters');

// Créer les index pour les performances
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.posts.createIndex({ "slug": 1 }, { unique: true });
db.posts.createIndex({ "createdAt": -1 });
db.comments.createIndex({ "postId": 1 });
db.comments.createIndex({ "createdAt": -1 });
db.newsletters.createIndex({ "email": 1 }, { unique: true });

print('✅ Base de données WebKlor initialisée avec succès');
print('📊 Collections créées : users, posts, comments, messages, newsletters');
print('🔍 Index créés pour optimiser les performances');
