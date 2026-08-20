---
sidebar_position: 3
title: Go
---

# Go

```bash
go get github.com/openai/openai-go/v3
```

```go
import (
	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
)

client := openai.NewClient(
	option.WithAPIKey(os.Getenv("DJELIA_API_KEY")),
	option.WithBaseURL("https://djelia.cloud/openai/v1"),
)
```

## Djelia extensions

`option.WithJSONSet` adds a body field the params struct does not define:

```go
chat, err := client.Chat.Completions.New(context.TODO(),
	openai.ChatCompletionNewParams{
		Model: "djelia-translate-v1",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.UserMessage("Bonjour, comment allez-vous ?"),
		},
	},
	option.WithJSONSet("djelia", map[string]string{
		"source_language": "fra_Latn",
		"target_language": "bam_Latn",
	}),
)
```

## Voices

`Voice` is a union type in this SDK, so a Djelia voice name is wrapped rather than
passed as a bare string:

```go
Voice: openai.AudioSpeechNewParamsVoiceUnion{OfString: openai.String("moussa")},
```

## Speech to a file

```go
res, err := client.Audio.Speech.New(context.TODO(), openai.AudioSpeechNewParams{
	Model: "djelia-tts-v2",
	Input: "Aw ni ce, i ka kene wa?",
	Voice: openai.AudioSpeechNewParamsVoiceUnion{OfString: openai.String("moussa")},
})
if err != nil {
	panic(err)
}
defer res.Body.Close()

out, _ := os.Create("hello.mp3")
defer out.Close()
io.Copy(out, res.Body)
```
