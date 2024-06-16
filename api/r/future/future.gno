package future

import (
	"time"
	
	"gno.land/p/demo/future"
	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

var tm *future.TimeMachine

func init() {
	tm = future.NewTimeMachine()
}

func WriteLetter(Recipient string, body string, attachment string, scheduledAt int64) string {
	return tm.WriteLetter(Recipient, body, attachment, scheduledAt)
}

func ReadLetter(id string) *future.Letter {
	return tm.ReadLetter(id)
}

func GetLetters() []*future.Letter {
	return tm.GetLetters()
}

func GetLettersJSON() string {
	letters := tm.GetLetters()
	if len(letters) == 0 {
		return "[]"
	}
	jsonResponse := json.ArrayNode("", []*json.Node{})
	for _, letter := range letters {
		node := json.ObjectNode("", map[string]*json.Node{
			"id": json.StringNode("id", letter.ID), 
			"author": json.StringNode("author", letter.Author.String()),
			"recipient": json.StringNode("recipient", letter.Recipient),
			"body": json.StringNode("body", letter.Body()),
			"scheduledAt": json.StringNode("scheduledAt", letter.ScheduledAt.String()),
			"sentAt": json.StringNode("sentAt", letter.SentAt.String()),
			"attachment": json.StringNode("attachment", letter.Attachment()),
		})
		jsonResponse.AppendArray(node)
	}

	b, err := json.Marshal(jsonResponse)
    if err != nil {
        ufmt.Errorf("error: %v", err)
    }

	return string(b)
}
 
func Render(path string) string {
	letters := GetLetters()

	if len(letters) == 0 {
		return "No letters :/"
	}

	response := ""
	
	for _, letter := range letters {
		response += "\nID: " + letter.ID + " | SentAt: " + letter.SentAt.String()
		if letter.ScheduledAt.After(time.Now()) {
			response += " | ScheduledAt: " + letter.ScheduledAt.String() 
		} else {
			response += " | Available"
		}
		response += "\n"
	}

	return response
}