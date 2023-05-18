package db

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/ayo-ajayi/simhash/go-api/model"
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
		log.Fatal("Error loading .env file")
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

func PostContent(entry model.Content)(primitive.ObjectID, error){
	collection:=community
	ctx, cancel:=context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err:=collection.InsertOne(ctx, bson.M{
		"user": entry.User,
		"mailcontent": entry.MailContent,
		"created_at":  time.Now().UTC(),
	})
	if err !=nil{
		return primitive.NilObjectID, err
	}
	return res.InsertedID.(primitive.ObjectID), nil
}