package db

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ayo-ajayi/simhash/go/model"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DB struct {
	client *mongo.Client
}

func Connect() *DB {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Error loading .env file")
	}
	mongo_url := os.Getenv("MONGODB_URL")
	client, err := mongo.NewClient(options.Client().ApplyURI(mongo_url))
	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	if err := client.Connect(ctx); err != nil {
		log.Fatal(err)
	}
	return &DB{
		client: client,
	}
}

var db = Connect()
var community = db.client.Database("simhash").Collection("Content")
func PostContent(entry model.Content) (primitive.ObjectID, int, error) {
    collection := community
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    var oldEntry model.Content
    err := collection.FindOne(ctx, bson.M{
        "Subject": entry.Subject,
        "Text":    entry.Text,
    }).Decode(&oldEntry)
    var responseCode int
    if err != nil {
        if err != mongo.ErrNoDocuments {
            responseCode = http.StatusForbidden
            return primitive.NilObjectID, responseCode, fmt.Errorf("query error: %w", err)
        }
        res, err := collection.InsertOne(ctx, bson.M{
            "Subject":    entry.Subject,
            "Text":       entry.Text,
            "Created_at": time.Now().UTC(),
        })
        if err != nil {
            responseCode = http.StatusBadRequest
            return primitive.NilObjectID, responseCode, fmt.Errorf("insertion error: %w", err)
        }
        responseCode = http.StatusCreated
        return res.InsertedID.(primitive.ObjectID), responseCode, nil
    }
    responseCode = http.StatusOK
    return oldEntry.ID, responseCode, nil
}
