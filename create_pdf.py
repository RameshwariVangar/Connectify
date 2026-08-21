import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return  # Cover page styling handled separately

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        self.drawString(54, 750, "CONNECTIFY — ARCHITECTURE, CODEBASE & INTERVIEW MASTERY GUIDE")
        
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.75)
        self.line(54, 742, 558, 742)
        
        self.line(54, 48, 558, 48)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 34, "Connectify Enterprise Documentation | Full-Stack MERN Architecture")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 34, page_text)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Palette
    c_primary = colors.HexColor("#1e3a8a")     # Deep Blue
    c_secondary = colors.HexColor("#2563eb")   # Bright Blue
    c_dark = colors.HexColor("#0f172a")        # Slate Dark Text
    c_accent = colors.HexColor("#0d9488")      # Teal Accent
    c_bg_light = colors.HexColor("#f8fafc")    # Light Card Slate
    c_border = colors.HexColor("#e2e8f0")      # Border Slate

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_primary,
        alignment=0,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#475569"),
        alignment=0,
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_primary,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_secondary,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'SectionH3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_dark,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_dark,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_dark,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6,
        borderRadius=4
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=4,
        spaceAfter=6
    )

    tbl_header = ParagraphStyle('TblHdr', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=colors.white)
    tbl_cell = ParagraphStyle('TblCell', fontName='Helvetica', fontSize=8.5, leading=11, textColor=c_dark)
    tbl_cell_bold = ParagraphStyle('TblCellB', fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=c_primary)

    story = []

    # ================= COVER / HEADER BANNER =================
    story.append(Paragraph("CONNECTIFY — COMPLETE PROJECT GUIDE & INTERVIEW MASTERY", title_style))
    story.append(Paragraph("Enterprise Full-Stack Social & Professional Networking Platform | Architecture, Folder Breakdown, Tech Concepts & Interview Q&A", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_secondary, spaceBefore=0, spaceAfter=15))

    # Executive Overview Box
    overview_html = """
    <b>Executive Overview:</b> Connectify is an end-to-end full-stack web application that seamlessly integrates social networking features (Twitter/X-style feed, media uploads, real-time posts, comments, likes) with professional networking capabilities (LinkedIn-style profile metadata, work/education history, connection requests, and dynamic PDF resume generation). It is built with high performance, scalability, and robust state management using Next.js 14, React 18, Redux Toolkit, Node.js, Express, and MongoDB Atlas.
    """
    tbl_data = [[Paragraph(overview_html, callout_style)]]
    tbl = Table(tbl_data, colWidths=[504])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor("#93c5fd")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 15))

    # ================= SECTION 1: SYSTEM ARCHITECTURE & WORKING =================
    story.append(Paragraph("1. Project Architecture & End-to-End Working", h1_style))
    story.append(Paragraph("Connectify follows a modular 3-tier full-stack architecture separating Client Rendering, State Management, RESTful API Controllers, and Persistence Layers:", body_style))

    arch_bullets = [
        "<b>1. Client Layer (Next.js Pages Router & React 18):</b> Renders responsive UI components, manages client-side routes (`/dashboard`, `/profile`, `/search`, `/chats`, `/my_connections`, `/view_profile/[username]`), handles authentication guards, and executes state updates.",
        "<b>2. Centralized State Layer (Redux Toolkit):</b> Maintains predictable global state across pages using Slices (`authSlice`, `postSlice`), Async Thunks (`getAboutUser`, `getAllPosts`, `accessChats`, `createPost`), and Memoized Selectors (`createSelector`).",
        "<b>3. REST API & Middleware Layer (Express.js & Node.js):</b> Handles incoming HTTP requests, routes endpoints modularly (`users.route.js`, `posts.route.js`), parses multipart media uploads using `Multer`, and manages static file serving (`express.static('uploads')`).",
        "<b>4. Database & Processing Layer (MongoDB Atlas, Mongoose, Sharp, PDFKit):</b> Stores user credentials, profiles, posts, comments, chats, and connections in MongoDB. Uses `Mongoose Populate` for document referencing, `Sharp` for WebP image normalization, and `PDFKit` for server-side dynamic PDF resume rendering."
    ]
    for b in arch_bullets:
        story.append(Paragraph(f"• {b}", bullet_style))
    story.append(Spacer(1, 10))

    # Core User Workflows Table
    story.append(Paragraph("Core User Workflows & Data Flow Summary:", h2_style))
    wf_headers = [Paragraph("Workflow Feature", tbl_header), Paragraph("Frontend Logic & Redux Action", tbl_header), Paragraph("Backend Controller & Database Action", tbl_header)]
    wf_rows = [
        [
            Paragraph("User Authentication", tbl_cell_bold),
            Paragraph("Login/Register form dispatches <code>loginUser</code> thunk. Saves crypto token in <code>localStorage</code>.", tbl_cell),
            Paragraph("<code>register</code> / <code>login</code> controller hashes password with <code>bcrypt</code>, generates crypto token, saves in MongoDB User model.", tbl_cell)
        ],
        [
            Paragraph("Dashboard Feed", tbl_cell_bold),
            Paragraph("Dispatches <code>getAllPosts()</code> & <code>getAboutUser()</code>. Renders <code>PostCard</code> list and comments modal.", tbl_cell),
            Paragraph("<code>getAllPosts</code> fetches posts populated with author <code>name</code>, <code>username</code>, <code>profilePicture</code>.", tbl_cell)
        ],
        [
            Paragraph("Post Creation & Media", tbl_cell_bold),
            Paragraph("Sends text and file via <code>FormData</code> in <code>createPost</code> thunk with Bearer token header.", tbl_cell),
            Paragraph("<code>Multer</code> handles disk storage in <code>uploads/</code>. Controller saves post with media path in MongoDB.", tbl_cell)
        ],
        [
            Paragraph("Connections Workflow", tbl_cell_bold),
            Paragraph("User sends request on profile page or search page via <code>sendConnectionRequest</code>.", tbl_cell),
            Paragraph("Saves pending request in <code>connectionReq</code> model. Accept/Reject updates status and connects users.", tbl_cell)
        ],
        [
            Paragraph("Real-Time Messaging", tbl_cell_bold),
            Paragraph("Clicking user opens chat via <code>accessChats</code> thunk. Message input dispatches <code>sendMsg</code>.", tbl_cell),
            Paragraph("Finds/creates Chat document between participants, appends message object to <code>messages</code> sub-document array.", tbl_cell)
        ],
        [
            Paragraph("PDF Resume Export", tbl_cell_bold),
            Paragraph("Profile page triggers window download to <code>/user/download_resume</code>.", tbl_cell),
            Paragraph("<code>downloadProfile</code> queries profile data, converts WebP images with <code>Sharp</code>, renders PDF buffer via <code>PDFKit</code>.", tbl_cell)
        ]
    ]
    
    t_wf = Table([wf_headers] + wf_rows, colWidths=[120, 194, 190])
    t_wf.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_wf)
    story.append(Spacer(1, 15))

    # ================= SECTION 2: FOLDER STRUCTURE & FILE-BY-FILE BREAKDOWN =================
    story.append(Paragraph("2. Complete Folder Structure & File-by-File Explanation", h1_style))
    story.append(Paragraph("Below is the exhaustive file structure and exact purpose of every single directory and file in Connectify:", body_style))

    # Backend Breakdown
    story.append(Paragraph("A. Backend Directory Structure (`/backend`)", h2_style))
    backend_files = [
        ("server.js", "Entry point of Node/Express server. Configures CORS, JSON body parser middleware, static file hosting for `/uploads`, MongoDB Atlas connection via Mongoose, registers `userRoutes` and `postRoutes`, and starts server on port 9090."),
        ("router/users.route.js", "Defines Express router for authentication (`/login`, `/register`), user profile fetching (`/get_user_and_profile`), connection requests (`/user/send_connection_requests`, `/user/accept_connection_req`), search (`/user/search`), direct messaging (`/access_Chats`, `/send_msg`, `/getChats`), profile picture upload (using Multer), and PDF resume download (`/user/download_resume`)."),
        ("router/posts.route.js", "Defines Express router for post operations (`/post`, `/posts`, `/delete_post`, `/increment_post_likes`, `/get_comments`, `/comment_post`). Integrates Multer disk storage middleware for post image uploads."),
        ("controllers/users.controllers.js", "Core backend controller containing business logic for user registration (bcrypt password hashing + crypto random token generation), login authentication, user profile fetching (with Mongoose `.populate('userId')`), updating bio/work/education, sending & accepting connection requests, user search via case-insensitive regex, real-time message sending/deletion, and server-side dynamic PDF resume compilation using PDFKit & Sharp."),
        ("controllers/posts.controllers.js", "Controller handling post creation (saving text body & Multer file path), fetching main feed posts populated with author metadata, incrementing likes count, deleting posts, posting comments, and retrieving comments for a specific post."),
        ("models/users.model.js", "Mongoose schema defining User documents: `name`, `email` (unique), `username` (unique), `password` (hashed), `profilePicture`, and `token`."),
        ("models/profiles.model.js", "Mongoose schema defining User Profile details: `userId` (ref to User), `bio`, `currentPost`, `pastWork` (array of company/position/years), `education` (array of school/degree/field)."),
        ("models/posts.model.js", "Mongoose schema for Posts: `userId` (ref to User), `body` (text), `likes` (number), `media` (filename string), `active` (boolean)."),
        ("models/comments.model.js", "Mongoose schema for Comments: `userId` (ref to User), `postId` (ref to Post), `body` (text)."),
        ("models/connections.model.js", "Mongoose schema for Connection Requests: `userId` (ref to requester User), `connectionId` (ref to recipient User), `status` ('pending' | 'accepted')."),
        ("models/chats.model.js", "Mongoose schema for Direct Messaging: `participants` (array of User refs), `messages` (array of objects with `senderId`, `messageText`, `timestamp`)."),
        ("uploads/", "Directory serving static media files (uploaded user avatars and post images) accessed publicly via Express static middleware.")
    ]

    for fname, fdesc in backend_files:
        story.append(Paragraph(f"• <b><code>{fname}</code></b>: {fdesc}", bullet_style))

    story.append(Spacer(1, 10))

    # Frontend Breakdown
    story.append(Paragraph("B. Frontend Directory Structure (`/frontend/src`)", h2_style))
    frontend_files = [
        ("pages/_app.js", "Next.js root application component. Wraps the entire web application with the Redux `Provider` store instance to supply global state to all pages."),
        ("pages/index.jsx", "Public landing page featuring brand header, platform hero banner, marketing tagline, and Join Now call-to-action button redirecting to `/login`."),
        ("pages/login/index.jsx", "Authentication page supporting both Login and Sign-Up tabs. Manages form states, handles password/email validation, dispatches `loginUser` / `registerUser` thunks, stores authentication token in `localStorage`, and auto-redirects to `/dashboard`."),
        ("pages/dashboard/index.jsx", "Main user feed page. Renders post creation card with file upload selector, main posts feed list, post likes toggle, comments modal drawer, right sidebar with top profiles, and automatic token authentication verification."),
        ("pages/profile/index.jsx", "Authenticated user's personal profile dashboard. Displays user avatar update button, bio, work history list, education list, modal forms for adding work/education, list of user's own posts, and PDF Resume Download button."),
        ("pages/view_profile/[username].jsx", "Dynamic Next.js route page for inspecting public profiles of other platform users. Displays user details, work history, education, past posts, and connection status button (Connect / Pending / Connected)."),
        ("pages/my_connections/index.jsx", "Connection management center. Displays incoming pending connection requests with Accept/Reject action buttons, and lists current connected user network."),
        ("pages/search/index.jsx", "User discovery search engine. Provides search bar with real-time query state, dispatches `searchUsers` thunk, and displays user cards with connect buttons."),
        ("pages/chats/index.jsx & getAllChats/index.jsx", "Real-time direct chat portal. Displays user conversation sidebar, active chat header, message history feed, message input composer with Enter key support, and message deletion capabilities."),
        ("config/index.jsx", "Base Axios HTTP client setup (`clientServer`). Configures base API URL (`http://localhost:9090`) for all frontend HTTP requests."),
        ("config/redux/store.js", "Redux Toolkit global store configuration. Combines `auth` reducer slice and `post` reducer slice into a unified store with Redux Thunk middleware."),
        ("config/redux/reducer/authReducer/index.js", "Auth Redux slice managing user profile state, `isTokenThere` boolean flag, user profiles list, search results, connections array, and active chat object. Handles async thunk pending/fulfilled/rejected lifecycle states."),
        ("config/redux/reducer/postReducer/index.js", "Post Redux slice managing all feed posts array, post comments array, active post ID for comments modal drawer, and post loading/error states."),
        ("config/redux/action/authAction/index.js", "Async Thunks for Auth: `loginUser`, `registerUser`, `getAboutUser`, `getAllUsers`, `sendConnectionRequest`, `getConnectionsRequest`, `getMyConnectionReq`, `AcceptConnection`, `searchUsers`, `accessChats`, `sendMsg`, `getAllChats`, `deleteMsg`."),
        ("config/redux/action/postAction/index.js", "Async Thunks for Posts: `getAllPosts`, `createPost` (multipart FormData upload), `deletePost`, `incrementPostLike`, `getAllComments`, `postComment`."),
        ("config/redux/selectors/authSelectors.js", "Memoized Reselect selectors for auth state: `selectLoggedUser`, `selectLoggedUserId`, `selectIsTokenThere`, `selectAllUsers`, `selectActiveChat`, `selectConnections`."),
        ("config/redux/selectors/postSelectors.js", "Memoized Reselect selectors for post state: `selectPosts`, `selectPostComments`, `selectActivePostId`."),
        ("layout/userLayout/index.jsx", "Global top-level layout wrapper including the responsive header `NavbarComponent`."),
        ("layout/DashBoardLayOut/index.jsx", "3-column responsive dashboard shell containing Left Navigation Bar (Scroll, Search, Connections, Chats), Center Feed Container, and Right Top Profiles Sidebar (sorted by post count)."),
        ("Components/Navbar/index.jsx", "Navigation header component with Connectify logo, user profile avatar, username handle, and secure Logout button (clears token and resets Redux state)."),
        ("utils/imageUtils.js", "Image URL utility providing fallback logic (`getImageUrl`) for missing/undefined images with inline SVG avatar data URIs, and `handleImageError` broken image replacement handler.")
    ]

    for fname, fdesc in frontend_files:
        story.append(Paragraph(f"• <b><code>{fname}</code></b>: {fdesc}", bullet_style))

    story.append(Spacer(1, 15))

    # ================= SECTION 3: TECHNOLOGIES & CONCEPTS MAPPING =================
    story.append(Paragraph("3. Technologies Used & Concept Mapping", h1_style))
    story.append(Paragraph("Connectify leverages modern software engineering concepts across the entire stack. The table below maps each technology to its specific implementation in the project:", body_style))

    tech_headers = [Paragraph("Technology Stack", tbl_header), Paragraph("Core Concepts Implemented", tbl_header), Paragraph("Where Used in Codebase", tbl_header)]
    tech_rows = [
        [
            Paragraph("<b>Next.js 14</b>", tbl_cell_bold),
            Paragraph("Pages Router (`/pages`), Dynamic Route Routing (`[username].jsx`), Client-side navigation (`useRouter`), Custom `_app.js` provider wrapper.", tbl_cell),
            Paragraph("`frontend/src/pages/`", tbl_cell)
        ],
        [
            Paragraph("<b>React 18</b>", tbl_cell_bold),
            Paragraph("Functional Components, Hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`), Memoization (`React.memo`), Controlled Inputs, Conditional Modal Rendering.", tbl_cell),
            Paragraph("`frontend/src/pages/`, `Components/`, `layout/`", tbl_cell)
        ],
        [
            Paragraph("<b>Redux Toolkit</b>", tbl_cell_bold),
            Paragraph("Global State Slice (`createSlice`), Async Logic (`createAsyncThunk`), Memoized Reselect Selectors (`createSelector`), Reducer Lifecycle (pending/fulfilled/rejected).", tbl_cell),
            Paragraph("`frontend/src/config/redux/`", tbl_cell)
        ],
        [
            Paragraph("<b>Node.js & Express</b>", tbl_cell_bold),
            Paragraph("Modular REST APIs (`express.Router`), Middleware pipeline (`cors`, `express.json`), Static File Serving (`express.static`), HTTP status code handling.", tbl_cell),
            Paragraph("`backend/server.js`, `router/`, `controllers/`", tbl_cell)
        ],
        [
            Paragraph("<b>MongoDB & Mongoose</b>", tbl_cell_bold),
            Paragraph("Document Schema Modeling, Relational References (`ref: 'User'`), Query Population (`.populate()`), Sub-document Arrays, Complex Queries (`$or`, `$regex`).", tbl_cell),
            Paragraph("`backend/models/`, `controllers/`", tbl_cell)
        ],
        [
            Paragraph("<b>Authentication & Security</b>", tbl_cell_bold),
            Paragraph("Password Hashing (`bcrypt.hash`), Crypto Random Token Generation (`crypto.randomBytes`), Bearer Authorization Headers, Client Token Persistence (`localStorage`).", tbl_cell),
            Paragraph("`backend/controllers/users.controllers.js`, `frontend/src/config/redux/action/`", tbl_cell)
        ],
        [
            Paragraph("<b>Multer & File Upload</b>", tbl_cell_bold),
            Paragraph("Multipart Form Data (`multipart/form-data`), Disk Storage Engine (`multer.diskStorage`), File Naming & Destination handling.", tbl_cell),
            Paragraph("`backend/router/`, `frontend/src/pages/dashboard/`", tbl_cell)
        ],
        [
            Paragraph("<b>Sharp & PDFKit</b>", tbl_cell_bold),
            Paragraph("Image format conversion (`WebP` to `PNG` buffer), Server-side dynamic PDF compilation, Stream Piping (`doc.pipe(stream)`), Vector layout text rendering.", tbl_cell),
            Paragraph("`backend/controllers/users.controllers.js`", tbl_cell)
        ],
        [
            Paragraph("<b>Axios & Utilities</b>", tbl_cell_bold),
            Paragraph("HTTP Client Configuration, Query Params serialization, Bearer Token injection, Fallback SVG Data URIs (`imageUtils.js`).", tbl_cell),
            Paragraph("`frontend/src/config/index.jsx`, `utils/imageUtils.js`", tbl_cell)
        ]
    ]

    t_tech = Table([tech_headers] + tech_rows, colWidths=[110, 240, 154])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 15))

    # ================= SECTION 4: INTERVIEW MASTERY & PRESENTATION GUIDE =================
    story.append(Paragraph("4. How to Present Connectify in an Interview", h1_style))
    story.append(Paragraph("When an interviewer asks <i>'Tell me about your project'</i>, follow this structured pitch format:", body_style))

    story.append(Paragraph("A. 60-Second Elevator Pitch (High-Impact Intro)", h2_style))
    pitch_60 = """
    "Connectify is a full-stack social and professional networking platform built using Next.js, Redux Toolkit, Node.js, Express, and MongoDB. It bridges the gap between social media engagement (like Twitter-style media posts, likes, and comments) and professional networking (like LinkedIn-style profile history, connection requests, and dynamic PDF resume generation). I architected the application with a modular REST API backend, stateful Redux workflow for async thunks, and responsive client layouts."
    """
    story.append(Paragraph(f"<i>{pitch_60}</i>", callout_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("B. 3-Minute Technical Deep Dive (5-Step Structure)", h2_style))
    steps = [
        "<b>Step 1: Problem & Product Vision:</b> Explain why you built Connectify—to combine lightweight social posting with professional user networking into one seamless web application.",
        "<b>Step 2: Architecture & Tech Stack Choice:</b> Mention Next.js Pages Router for UI rendering, Redux Toolkit for global state, Express REST APIs for server business logic, and MongoDB for scalable document storage.",
        "<b>Step 3: Core Flow & State Management:</b> Describe how Redux Thunks handle asynchronous API requests (login, profile fetching, post creation with FormData) and update slices using memoized selectors to avoid unnecessary React re-renders.",
        "<b>Step 4: Key Feature Deep-Dive (Dynamic PDF Generation & Image Processing):</b> Highlight server-side resume generation where user profile data and Sharp-converted images are dynamically compiled into a PDF document using PDFKit.",
        "<b>Step 5: Challenges & Optimizations:</b> Discuss how you solved the infinite loading bug on dashboard refresh by handling Redux thunk pending/rejected states, adding resilient image fallback handlers, and using React.memo to optimize list rendering."
    ]
    for s in steps:
        story.append(Paragraph(f"• {s}", bullet_style))

    story.append(Spacer(1, 15))

    # ================= SECTION 5: TOP 15 INTERVIEW QUESTIONS & ANSWERS =================
    story.append(Paragraph("5. Top 15 Technical Interview Questions & Answers", h1_style))
    story.append(Paragraph("Here are the top technical questions interviewers will ask about Connectify, along with expert answers:", body_style))

    qna_list = [
        (
            "Q1: Why did you use Next.js instead of standard Create React App (CRA)?",
            "Next.js provides an out-of-the-box file-system based router (Pages Router), SSR/CSR capabilities, optimized build splitting, and seamless SEO metadata support, whereas CRA is deprecated and lacks built-in server-side optimization."
        ),
        (
            "Q2: How does authentication work in Connectify without third-party JWT libraries?",
            "During registration or login, the backend generates a 32-byte cryptographic random hex token (`crypto.randomBytes(32).toString('hex')`) and saves it directly in the MongoDB User document. The token is sent to the client, stored in `localStorage`, and attached as a Bearer authorization token or query parameter on subsequent API requests."
        ),
        (
            "Q3: Why did you use Redux Toolkit createSelector instead of basic useSelector?",
            "`createSelector` creates memoized selectors that only re-compute when their specific input state slice changes. Using plain `useSelector` with inline object transformations causes component re-renders on every Redux store update, hurting UI performance."
        ),
        (
            "Q4: How does Mongoose populate work under the hood in getUserAndProfile?",
            "`Profile.findOne({ userId: user._id }).populate('userId', 'name email username profilePicture')` performs a join-like operation in Mongoose by replacing the `userId` ObjectId reference with the actual populated fields from the `User` collection."
        ),
        (
            "Q5: How is file upload handled when creating a post?",
            "On the frontend, file and text body are appended to a JavaScript `FormData` object and sent via Axios with `'Content-Type': 'multipart/form-data'`. On the backend, `Multer` intercepts the request, saves the image file to `/uploads`, and attaches `req.file.filename` to the controller."
        ),
        (
            "Q6: How does server-side dynamic PDF resume download work in Connectify?",
            "When `/user/download_resume` is called, the backend fetches user and profile documents from MongoDB, uses `Sharp` to convert WebP avatar images to PNG buffers, initializes a `PDFKit` document stream, writes formatted layout text/sections, and pipes the output stream directly as a downloadable PDF file."
        ),
        (
            "Q7: What was the bug with Dashboard infinite loading, and how did you resolve it?",
            "Initially, `getAboutUser.rejected` was not handled in Redux. If a token was invalid or `getAboutUser` failed, `user` remained `undefined` forever while `isTokenThere` was true, locking the dashboard in a 'Loading Dashboard...' loop. I fixed it by adding `getAboutUser.pending/fulfilled/rejected` reducers to clear invalid tokens and auto-redirect to `/login`."
        ),
        (
            "Q8: Why did you use React.memo and useCallback on PostCard?",
            "`React.memo` prevents `PostCard` from re-rendering unless its props (`post`, `loggedUserId`) actually change. Wrapping action handlers (`onLikePost`, `onDeletePost`) in `useCallback` ensures function references remain stable across re-renders."
        ),
        (
            "Q9: How are connection requests statefully managed between users?",
            "Connection requests are stored in the `connections` collection with `userId` (requester), `connectionId` (recipient), and `status` ('pending' | 'accepted'). When user A requests user B, status is 'pending'. When user B accepts, status updates to 'accepted' and both users gain connection privileges."
        ),
        (
            "Q10: How does the user search engine work?",
            "The backend search controller receives a `query` string parameter and executes a Mongoose query using MongoDB `$or` regex operators: `User.find({ $or: [{ name: { $regex: query, $options: 'i' } }, { username: { $regex: query, $options: 'i' } }] })`. This enables fast case-insensitive user search."
        ),
        (
            "Q11: How does the chat system store direct messages in MongoDB?",
            "The `Chat` model stores a `participants` array containing two user ObjectIds and a `messages` sub-document array containing objects (`senderId`, `messageText`, `timestamp`). `accessChat` finds or initializes the conversation document, and `sendMsg` pushes new message objects to the array."
        ),
        (
            "Q12: What is the difference between createSlice reducers and extraReducers?",
            "`reducers` are used for synchronous state mutations defined internal to the slice (e.g. `setTokenIsThere`, `reset`). `extraReducers` respond to external actions, such as `createAsyncThunk` lifecycle actions (`pending`, `fulfilled`, `rejected`)."
        ),
        (
            "Q13: How do you handle broken or missing profile images gracefully?",
            "In `imageUtils.js`, `getImageUrl` checks if the image path is null/empty and returns an inline SVG data URI avatar placeholder. Additionally, `handleImageError` catches `onError` image events and replaces broken URLs with `DEFAULT_AVATAR`."
        ),
        (
            "Q14: How are comments implemented in Connectify?",
            "Comments are stored in a dedicated `Comment` collection referencing `postId` and `userId`. Clicking a post's comment button sets `activePostId` in Redux, opening a slide-over modal drawer that fetches comments via `getAllComments({ post_id })`."
        ),
        (
            "Q15: How would you scale Connectify for 100,000 active users?",
            "1) Replace polling with **Socket.io / WebSockets** for instant real-time chat. 2) Implement **JWT tokens with short expiration & refresh tokens** stored in HTTP-only cookies. 3) Cache popular posts & user feeds using **Redis**. 4) Offload media uploads from server disk to **AWS S3 / Cloudinary** CDN."
        )
    ]

    for q, a in qna_list:
        q_box = [
            Paragraph(f"<b>{q}</b>", h3_style),
            Paragraph(a, body_style)
        ]
        story.append(KeepTogether(q_box))
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == "__main__":
    out_pdf = os.path.join(os.getcwd(), "Connectify_Complete_Project_Guide_and_Interview_Mastery.pdf")
    build_pdf(out_pdf)
