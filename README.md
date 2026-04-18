<p align="center">
    <picture>
        <img height="250" src="/infrastructure/assets/logo-cropped.png" />
    </picture>
</p>

<p align="center">
    <img src="https://img.shields.io/node/v-lts/react?style=for-the-badge" />
    <img src="https://img.shields.io/github/package-json/v/asad-bashir-442/slide-quiz?filename=client%2Fpackage.json&style=for-the-badge" />
    <img src="https://img.shields.io/github/license/asad-bashir-442/slide-quiz?style=for-the-badge" />
    <img src="https://img.shields.io/github/repo-size/asad-bashir-442/slide-quiz?style=for-the-badge" />
</p>

<br />

SlideQuiz is a web application that simplifies creating and hosting live quizzes during presentations. It gives instructors and presenters the tools to ask questions alongside their slides, enabling real-time participation from students or audience members.

## Features

- Quiz creation/management
- Live quiz sessions with unique session codes for participants
- Real-time participant answer submission
- Manual Mode: Host controls when each question appears
- Automatic Mode: Questions advance as the user answers a question
- Export quizzes and results to `.csv`

## Project Structure

The source code for SlideQuiz is split into three parts:

```
├── client/         - The frontend of SlideQuiz.
├── server/         - The backend of SlideQuiz.
└── infrastructure/ - The infrastructure used to host/deploy SlideQuiz.
```

## Showcase

<p align="center">
    <a href="https://www.youtube.com/watch?v=2cZ2lFAUXWQ">
        <img src="/infrastructure/assets/thumbnail.png" width="650" />
    </a>
    <br />
    <a href="https://www.youtube.com/watch?v=2cZ2lFAUXWQ">Watch on YouTube</a>
</p>

## Hosting & Development

See [infrastructure](infrastructure/README.md).

```sh
cd infrastructure
make dev-up

# Alternative without GNU Make
docker compose -f docker-compose.dev.yml up -d
```

## Authors

- Micah Seip - 0864556
- Asad Bashir - 0848761
- Kirsten Arnold - 0863060

## License

[MIT](LICENSE)
