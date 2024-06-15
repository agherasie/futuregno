package future

import (
	"testing"
	"std"
	"time"

	"gno.land/p/demo/testutils"
)

func TestGetAvailableLEtters(t *testing.T) {

	alice := testutils.TestAddress("alice")
	std.TestSetOrigCaller(alice)
	now := time.Now()
	past := now.Add(time.Hour*24*365).Format(time.RFC822)
	present := now.Format(time.RFC822)
	future := now.Add(-time.Hour*24*365).Format(time.RFC822)
	t.Log(past)
	t.Log(present)
	t.Log(future)
 
	tm := NewTimeMachine()
	tm.WriteLetter(alice.String(), "body", "attachment", past)
	tm.WriteLetter(alice.String(), "body", "attachment", future)
	tm.WriteLetter("xxxx", "body", "attachment", future)
	tm.WriteLetter("xxxx", "body", "attachment", past)

	letters := tm.GetAvailableLetters()
	if len(letters) != 1 {
		t.Errorf("expected 1 letters, got %d", len(letters))
	}
}