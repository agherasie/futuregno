package future

import (
	"time"
	
	"gno.land/p/demo/future"
)

var tm *future.TimeMachine

func init() {
	tm = future.NewTimeMachine()
}

func WriteLetter(Recipient string, body string, attachment string, scheduledAt string) string {
	return tm.WriteLetter(Recipient, body, attachment, scheduledAt)
}

func ReadLetter(id string) *future.Letter {
	letter, err := tm.ReadLetter(id)
	if err != nil {
		panic(err)
	}
	return letter
}

func GetLetters() []*future.Letter {
	return tm.GetLetters()
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