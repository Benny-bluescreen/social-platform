# Social Platform

Detta är ett projekt för en social plattform där användare kan registrera sig, logga in, ändra lösenord och logga ut. Projektet är en del av en skoluppgift i en kurs i mjukvarutestning.

## Funktioner

- Registrering av nya användare
- Inloggning för befintliga användare
- Ändring av lösenord
- Utloggning

## Teknologier

- Node.js
- Express
- Sequelize
- SQLite
- Jest (för enhetstester)
- GitHub Actions (för CI/CD)

## Installation

1. Klona detta repository:
    ```sh
    git clone https://github.com/your-username/social-platform.git
    ```
2. Navigera till projektmappen:
    ```sh
    cd social-platform
    ```
3. Installera beroenden:
    ```sh
    npm install
    ```
4. Starta servern:
    ```sh
    npm start
    ```

## Testning

För att köra enhetstester, använd följande kommando:
```sh
npm test
```

### Beskrivning av tester

Testerna är skrivna med Jest och täcker följande funktioner:

- **Registrering av användare:** Testar att nya användare kan registrera sig med giltiga uppgifter och att felmeddelanden visas för ogiltiga uppgifter.
- **Inloggning:** Verifierar att befintliga användare kan logga in med korrekta uppgifter och att felmeddelanden visas för ogiltiga uppgifter.
- **Ändring av lösenord:** Säkerställer att användare kan ändra sitt lösenord och att felmeddelanden visas vid ogiltiga försök.
- **Utloggning:** Testar att användare kan logga ut korrekt.

Testerna körs automatiskt via GitHub Actions vid varje push till repositoryt för att säkerställa kontinuerlig integration och leverans (CI/CD).