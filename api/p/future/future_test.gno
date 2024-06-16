package future

import (
	"testing"
	"std"
	"time"

	"gno.land/p/demo/testutils"
)

func TestGetLetters(t *testing.T) {

	alice := testutils.TestAddress("alice")
	std.TestSetOrigCaller(alice)
	now := time.Now() 
	present := now.UnixMilli()
	future := now.Add(time.Hour*24*365).UnixMilli()
 
	tm := NewTimeMachine() 
	tm.WriteLetter(alice.String(), "body", "attachment", present)
	tm.WriteLetter(alice.String(), "body", "attachment", future)
	tm.WriteLetter("xxxx", "body", "attachment", future) 

	letters := tm.GetLetters()
	if len(letters) != 3 {
		t.Errorf("expected 3 letters, got %d", len(letters))
	}
	available := tm.GetAvailableLetters()
	if len(available) != 1 {
		t.Errorf("expected 1 letters, got %d", len(available))
	}

}

func TestWriteLetterInThePast(t *testing.T) {
	alice := testutils.TestAddress("alice")
	std.TestSetOrigCaller(alice)
	tm := NewTimeMachine() 
	
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("The code did not panic")
		}
	}()
	id := tm.WriteLetter("bob", "body", "attachment", time.Now().UnixMilli()-1)
}

func TestWriteInstantLetter(t *testing.T) {
	alice := testutils.TestAddress("alice")
	std.TestSetOrigCaller(alice)
	tm := NewTimeMachine() 
	  
	id := tm.WriteLetter(alice.String(), "body", "attachment", 0)

	letters := tm.GetAvailableLetters()
	if len(letters) != 1 {
		t.Errorf("expected 1 letters, got %d", len(letters))
	}
}

func TestGetLetter(t *testing.T) {
	alice := testutils.TestAddress("alice")
	std.TestSetOrigCaller(alice)
	tm := NewTimeMachine() 
	id := tm.WriteLetter(alice.String(), "body", "attachment", time.Now().UnixMilli()+1)

	letter := tm.GetLetter(id)
	if letter == nil {
		t.Errorf("letter not found")
	}
}

func TestReadLetterNotAvailable(t *testing.T) {
	alice := testutils.TestAddress("alice")
	std.TestSetOrigCaller(alice)
	tm := NewTimeMachine() 
	id := tm.WriteLetter(alice.String(), "body", "attachment", time.Now().UnixMilli()+1)
 
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("The code did not panic")
		}
	}()

	letter := tm.ReadLetter(id)
	
}

func TestReadLetterNotFound(t *testing.T) {
	alice := testutils.TestAddress("alice")
	std.TestSetOrigCaller(alice)
	tm := NewTimeMachine() 
	id := tm.WriteLetter(alice.String(), "body", "attachment", 0)
 
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("The code did not panic")
		}
	}()

	letter := tm.ReadLetter("abcd")
	
}
