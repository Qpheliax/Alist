if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  uri = process.env.DB_URL || "mongodb://localhost:27017/anime-db",
  path = require("path"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  morgan = require("morgan"),
  colors = require("colors"),
  ejsMate = require("ejs-mate"),
  session = require("express-session"),
  MongoDBStore = require("connect-mongo")(session),
  flash = require("connect-flash"),
  passport = require("passport"),
  mongoSanitize = require("express-mongo-sanitize"),
  LocalStrategy = require("passport-local"),
  helmet = require("helmet"),
  User = require("./models/user"),
  ExpressError = require("./utils/ExpressError"),
  userRoutes = require("./routes/users"),
  homeRoutes = require("./routes/home"),
  commentRoutes = require("./routes/comments"),
  animetitlesRoutes = require("./routes/playgrounds");

app.listen(port, () => console.log("Backend server live on " + port));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate); // style tool
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(mongoSanitize()); //sanitize

const secret = process.env.SECRET || "secret";

const store = new MongoDBStore({
  url: uri,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("session store error", e);
});

const sessionConfig = {
  store,
  name: "_atmta",
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "strict",
    // secure: true,
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const styleSrcUrls = [
  "https://fonts.googleapis.com/",
  "https://fonts.gstatic.com/",
];

const fontSrcUrls = [
  "https://fonts.googleapis.com/",
  "https://fonts.gstatic.com/",
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'", "'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "url:",
        "data:",
        "https://res.cloudinary.com/qpheliax/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

/* passport */
app.use(passport.initialize());
// !use passport.session() before session(sessionConfig)
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //*how to store user in session
passport.deserializeUser(User.deserializeUser()); //*how to get user out of session

/*check user, flash middleware */
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));
app.use(morgan("dev"));

/* console evets time middleware */
app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString().blue;
  console.log(req.requestTime);
  next();
});

/* Routes */
app.use("/", userRoutes, homeRoutes);
app.use("/list/", animetitlesRoutes);
app.use("/list/list:id/page:page/title:id/comments", commentRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Error";
  res.status(status).render("error", { err, pagetitle: "Animelist🌸Error" });
});
