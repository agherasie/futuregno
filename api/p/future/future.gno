package future


import ( 
	"std"  
	"time"
    "errors"  
  
	"gno.land/p/demo/seqid" 
)

type Letter struct {
	ID string
	Author std.Address
	Recipient string
	
	body string
	attachment string
	
	SentAt time.Time
	ScheduledAt time.Time
}

func (l *Letter) Body() string {
	

	return l.body
}

func (l *Letter) Attachment() string {
	return l.attachment
}

type TimeMachine struct {
	Letters []*Letter
	IDCounter seqid.ID
}

func NewTimeMachine() *TimeMachine {
	return &TimeMachine{ 
		Letters: make([]*Letter, 0),
	}
}

func (tm *TimeMachine) WriteLetter(Recipient string, body string, attachment string, scheduledAt string) string {
	
	id := tm.IDCounter.Next().String()

	scheduledAtParsed, err := time.Parse(time.RFC822, scheduledAt)
	if err != nil {
		panic(err)
	}

	newLetter := &Letter{
		ID: id,
		Author: std.PrevRealm().Addr(),
		Recipient: Recipient,
		body: body,
		attachment: attachment,
		SentAt: time.Now(),
		ScheduledAt: scheduledAtParsed,
	}

	tm.Letters = append(tm.Letters, newLetter)
	return id	
}

func (tm *TimeMachine) GetLetter(id string) *Letter {
	for _, letter := range tm.Letters {
		if letter.ID == id {
			return letter
		}
	}

	return nil
}

func (tm *TimeMachine) ReadLetter(id string) (*Letter, error) {
	letter := tm.GetLetter(id)
	if letter == nil {
		return nil, errors.New("Letter not found")
	}

	if time.Now().After(letter.ScheduledAt) {
		return letter, nil
	}

	return nil, errors.New("Letter not yet available")
}

func (tm *TimeMachine) GetLetters() []*Letter {
	return tm.Letters
}

func (tm *TimeMachine) GetAvailableLetters() (ret []*Letter) {
	for _, letter := range tm.Letters {
		if time.Now().Before(letter.ScheduledAt) { 
			continue
		}
		// ufmt.Println(std.PrevRealm().Addr().String())
		if letter.Recipient != std.PrevRealm().Addr().String() {
			continue
		}
		ret = append(ret, letter)
	}

	return
}
