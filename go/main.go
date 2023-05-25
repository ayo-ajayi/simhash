package main

import (
	"log"
	"os"


	"github.com/ayo-ajayi/simhash/go/ctrl"
	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"

)

func main() {
	router := gin.Default()
	CORSMiddleware := cors.Default
	router.Use(CORSMiddleware())
	router.GET("/", ctrl.Welcome)
	router.POST("/post", ctrl.PostContent)
	port := os.Getenv("GO_PORT")
	log.Fatal(router.Run(":" + port))
}
