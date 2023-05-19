package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Content struct {
	ID          primitive.ObjectID `json:"id" bson:"_id"`
	User        string             `json:"user" bson:"user" binding:"required,email"`
	MailContent string             `json:"mailcontent" bson:"mailcontent" binding:"required"`
	CreatedAt  time.Time          `bson:"created_at,omitempty"`
}