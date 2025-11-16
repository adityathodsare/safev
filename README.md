# SafeV

A comprehensive security and validation toolkit for modern applications.

## 📋 Overview

SafeV is a robust security framework designed to help developers implement best practices for data validation, sanitization, and security checks in their applications. It provides a collection of utilities and tools to ensure your application handles user input safely and securely.

## ✨ Features

- **Input Validation**: Comprehensive validation rules for various data types
- **Data Sanitization**: Clean and sanitize user input to prevent security vulnerabilities
- **Security Checks**: Built-in security validators for common attack vectors
- **Easy Integration**: Simple API that integrates seamlessly with existing projects
- **Lightweight**: Minimal dependencies and optimized performance
- **Type-Safe**: Full TypeScript support with type definitions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

```bash
# Using npm
npm install safev

# Using yarn
yarn add safev
```

## 📖 Usage

### Basic Example

```javascript
import { validate, sanitize } from 'safev';

// Validate email
const email = validate.email('user@example.com');
console.log(email.isValid); // true

// Sanitize HTML input
const cleanHTML = sanitize.html('<script>alert("XSS")</script><p>Hello</p>');
console.log(cleanHTML); // <p>Hello</p>
```

### Advanced Usage

```javascript
import { Validator, SecurityCheck } from 'safev';

// Create custom validator
const validator = new Validator({
  username: {
    type: 'string',
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  password: {
    type: 'string',
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
});

// Validate user input
const result = validator.validate({
  username: 'john_doe',
  password: 'SecurePass123!'
});

if (result.isValid) {
  console.log('Validation passed!');
} else {
  console.error('Validation errors:', result.errors);
}

// Perform security checks
const securityCheck = new SecurityCheck();
const isSafe = securityCheck.checkSQL(userInput);
```

## 🛠️ API Reference

### Validation Methods

- `validate.email(value)` - Validate email addresses
- `validate.url(value)` - Validate URLs
- `validate.phone(value)` - Validate phone numbers
- `validate.creditCard(value)` - Validate credit card numbers
- `validate.ipAddress(value)` - Validate IP addresses

### Sanitization Methods

- `sanitize.html(value)` - Remove dangerous HTML tags and attributes
- `sanitize.sql(value)` - Escape SQL injection attempts
- `sanitize.xss(value)` - Prevent cross-site scripting attacks
- `sanitize.filename(value)` - Clean filenames for safe storage

### Security Checks

- `SecurityCheck.checkSQL(value)` - Detect SQL injection attempts
- `SecurityCheck.checkXSS(value)` - Detect XSS attempts
- `SecurityCheck.checkPathTraversal(value)` - Detect path traversal attempts

## 🔧 Configuration

Create a `safev.config.js` file in your project root:

```javascript
module.exports = {
  validation: {
    strictMode: true,
    customRules: {
      // Add your custom validation rules
    }
  },
  sanitization: {
    allowedTags: ['p', 'br', 'strong', 'em'],
    allowedAttributes: {
      'a': ['href', 'title']
    }
  }
};
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Building

```bash
# Build for production
npm run build

# Build and watch for changes
npm run build:watch
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Aditya Thodsare** - [GitHub](https://github.com/adityathodsare)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape SafeV
- Inspired by best practices from OWASP and security community
- Built with modern JavaScript security principles

## 📞 Support

If you have any questions or need help, please:

- Open an issue on [GitHub Issues](https://github.com/adityathodsare/safev/issues)
- Check the [documentation](https://github.com/adityathodsare/safev/wiki)
- Join our community discussions

## 🔒 Security

If you discover a security vulnerability, please send an email to [your-email@example.com]. All security vulnerabilities will be promptly addressed.

## 📈 Roadmap

- [ ] Add more validation rules
- [ ] Implement machine learning-based threat detection
- [ ] Add support for more frameworks
- [ ] Improve documentation and examples
- [ ] Add CLI tool for quick security checks

## ⭐ Star History

If you find this project helpful, please consider giving it a star!

---

Made with ❤️ by [Aditya Thodsare](https://github.com/adityathodsare)
