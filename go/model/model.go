package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Content struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	Subject   string             `json:"subject" bson:"Subject" binding:"required"`
	Text      string             `json:"text" bson:"Text" binding:"required"`
	CreatedAt time.Time          `bson:"created_at,omitempty"`
}
