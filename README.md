# Disposable Email Service

## Overview
A TypeScript/Node.js library that provides programmatic access to disposable email addresses from popular services like Mail10Min and TempMail. This library enables you to generate temporary email addresses and retrieve email content programmatically, making it ideal for testing, automation, and privacy-focused applications.

## Features
- **Multiple Service Support**: Works with Mail10Min and TempMail services
- **Headless Browser Automation**: Uses Puppeteer with stealth plugins for services that require browser interaction
- **HTTP/2 Support**: Efficient HTTP/2 fetching for compatible services
- **Session Management**: Maintains cookies for persistent email sessions
- **Email Content Retrieval**: Check for incoming emails and retrieve subject/content
- **TypeScript Support**: Fully typed with TypeScript definitions
- **Stealth Mode**: Includes adblocker and stealth plugins to avoid detection

## How It Works
The library supports two types of disposable email services:

1. **Headless Browser Services**: For services like Mail10Min that require browser interaction, the library uses Puppeteer with stealth plugins to automate email generation and retrieval.

2. **HTTP/2 API Services**: For services that provide HTTP/2 APIs, the library uses native HTTP/2 fetching for efficient communication.

The library maintains session state through cookies, allowing you to check for incoming emails after generating a disposable address.

## Requirements
- Node.js (version compatible with Puppeteer)
- TypeScript (for TypeScript projects)

## Installation
To install the library, use npm:

```bash
npm install @doanthai/disposable-email-service
```

## Usage
Here is a simple example of how to use the library:

```typescript
import { DisposableEmailHelper, MailServices } from '@doanthai/disposable-email-service';

// Create an instance with default service (Mail10Min)
const emailHelper = new DisposableEmailHelper({
  mailService: MailServices.MAIL10MIN
});

// Get a disposable email address
const { email, cookie } = await emailHelper.getMail();
console.log('Your disposable email:', email);

// Later, check for email content
if (cookie) {
  const { subject, content } = await emailHelper.getContent(cookie, email);
  console.log('Email subject:', subject);
}
```

## API Documentation

### DisposableEmailHelper

Main class for interacting with disposable email services.

#### Constructor
- **Parameters**:
  - `options` (DisposableServiceOptions): Configuration options
    - `mailService` (MailServices, optional): The mail service to use. Defaults to `MailServices.MAIL10MIN`

#### Methods

##### `getMail(customHeaders?: CustomHeader): Promise<MailRes>`
Get a disposable email address from the configured mail service.

- **Parameters**:
  - `customHeaders` (CustomHeader, optional): Custom HTTP headers or cookies to include in the request
- **Returns**: Promise resolving to `MailRes` object containing:
  - `email` (string | null): The disposable email address
  - `cookie` (CookieData[], optional): Session cookies for maintaining state

##### `getContent(cookie: CookieData[], from: string): Promise<ContentMailRes>`
Get the content of emails received at the disposable email address.

- **Parameters**:
  - `cookie` (CookieData[]): Session cookies from the initial `getMail()` call
  - `from` (string): The email address to check for new emails
- **Returns**: Promise resolving to `ContentMailRes` object containing:
  - `subject` (string | null): The email subject
  - `content` (string | null): The email content (currently not fully implemented)
  - `cookie` (CookieData[], optional): Updated session cookies

**Note**: Currently only supports headless services and retrieves email subjects. Full content fetching is not yet implemented.

##### `getServices(): string[]`
Get a list of supported email service URLs.

- **Returns**: Array of service URLs

### Enums

#### MailServices
- `MAIL10MIN`: Mail10Min service (https://10minutemail.net/)
- `TEMPMAIL`: TempMail service (https://temp-mail.org/)

## Publishing

This project uses [Lerna](https://lerna.js.org/) for version management and publishing to GitHub Packages.

### Prerequisites

1. Set up GitHub Personal Access Token with `write:packages` permission
2. Configure authentication in `.npmrc`:
   ```bash
   export GITHUB_TOKEN=your_github_token_here
   ```

### Publishing Commands

```bash
# Build the project
npm run build

# Check what packages have changed
npm run lerna:changed

# Version and publish (interactive)
npm run lerna:publish

# Or use the release script (build + publish)
npm run release
```

### Manual Publishing

If you prefer to publish manually:

```bash
# Build first
npm run build

# Then publish using Lerna
lerna publish
```

Lerna will:
- Detect version changes
- Create git tags
- Publish to GitHub Packages registry
- Create GitHub releases (if configured)

## Contributing
Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License
This project is licensed under the [LICENSE](LICENSE) - see the LICENSE file for details.