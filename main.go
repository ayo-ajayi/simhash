package main

import (
	"log"
	"os"

	"github.com/ayo-ajayi/simhash/go-api/ctrl"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/", ctrl.Welcome)
	router.POST("/post", ctrl.PostContent)
	port := os.Getenv("PORT")
	log.Fatal(router.Run(":" + port))
}