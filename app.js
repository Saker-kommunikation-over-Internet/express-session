const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const PORT = 8000;

// Middleware är någonting som kommer in emellan requesten och routen.
app.use((_req, _res, next) => {
  //Om ett argument inte ska användas kan du säga åt VSCode att lägga en _ framför.
  console.log("Middleware!"); //Loggar nu "Middleware!" vid varje request.
  next(); //Next går vidare till routen (eller nästa middleware). Utan next() kommer applikationen stå still.
});

// Sätter upp servern att lyssna på inkommande requests.
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

// Secret: En nyckel som används för att generera session-id. Om den läcker kan en illvillig användare skapa egna sessions hur den vill.
// save: Om sessionsdata ska sparas oavsett om ingen data har modifierats.
// saveUnitialized: Om servern ska lagra en ny session direkt. Detta bryter faktiskt mot GDPR! Man behöver användarens samtycke.
app.use(
  session({ secret: "myUnsafeSecret", saveUninitialized: false, resave: false })
);

// Tillåter oss att läsa datan från formuläret.
app.use(bodyParser.urlencoded({ extended: false }));

// Tillåter oss att serva public files.
app.use(express.static("public"));

// Lägger en route i / (roten)
app.get("/", (req, res) => {
  req.session.mySecretMessage = "42"; //Lägger till egenskapen mySecretMessage som går att komma åt i varje reqeust från användaren.
  res.send(`${req.session.mySecretMessage}`);
});

//Servar index.html
app.get("/form", (_req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// Modifierar session om användarnamn och lösenord stämmer.
app.post("/login", (req, res) => {
  if (req.body.username === "kristian" && req.body.password === "123") {
    req.session.isAuthenticated = true;
    return res.send("You are now logged in!");
  }
  res.send("Invalid Credentials");
});

// En route som returner olika beroende på om man är autentiserad eller inte.
app.get("/protected", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.send("Not authenticated!");
  }
  res.send("Authenticated!");
});

/*
1. Sätt upp express
2. Sätt upp middleware med en route
3. Sätt upp express-session med allting false. Visa cookies i webbläsaren.
4. Visa saveUninitialized. Modifiera req.session
5. Sätt upp ett formulär i webbläsaren.
6. Sätt upp body-parser och en login-route
7. Sätt upp en skyddad route.
 */
