package ctrl

import (
	"net/http"

	"github.com/ayo-ajayi/simhash/go/db"
	"github.com/ayo-ajayi/simhash/go/model"
	"github.com/gin-gonic/gin"
)

func Welcome(c *gin.Context){
	c.JSON(200, gin.H{
		"message": "Welcome",
	})
}
func PostContent(c *gin.Context){
	var content model.Content
	if err := c.ShouldBindJSON(&content); err != nil{
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	entryID, err:= db.PostContent(content)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	content.ID =entryID
	content.CreatedAt = entryID.Timestamp()
	c.JSON(201, gin.H{
		"response": content})
}