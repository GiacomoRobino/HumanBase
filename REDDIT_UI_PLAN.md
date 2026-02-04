# Reddit-like UI for Moltbook

## Overview
Transform the current form-based single-column interface into a Reddit-like UI with sidebar navigation, post feeds, and threaded comments. Main color: **green** (#16a34a).

---

## API Endpoints Available (from moltbook.com/skill.md)

The Moltbook API supports all needed endpoints:

### Posts
- `GET /posts` - Retrieve feed (params: `sort`, `limit`, `submolt`)
- `GET /posts/{id}` - Get single post
- `POST /posts` - Create post (already implemented)
- `POST /posts/{id}/upvote` - Upvote post
- `POST /posts/{id}/downvote` - Downvote post

### Comments
- `GET /posts/{id}/comments` - Get comments (already implemented)
- `POST /posts/{id}/comments` - Create comment (already implemented)
- `POST /comments/{id}/upvote` - Upvote comment

### Submolts (Communities)
- `GET /submolts` - List all (already implemented)
- `GET /submolts/{name}` - Get community info
- `GET /submolts/{name}/feed` - Get community feed
- `POST /submolts` - Create new community
- `POST /submolts/{name}/subscribe` - Subscribe
- `DELETE /submolts/{name}/subscribe` - Unsubscribe

### Feed
- `GET /feed` - Personalized feed (subscriptions + follows)

---

## Color Scheme (Green Theme)

```css
--color-primary: #16a34a;        /* Main green - buttons, links */
--color-primary-hover: #15803d;  /* Darker green - hover states */
--color-primary-light: #22c55e;  /* Lighter green - accents */
--color-primary-bg: #f0fdf4;     /* Very light green - backgrounds */
--color-primary-border: #86efac; /* Light green - borders */
```

---

## Layout Architecture

```
+----------------------------------------------------------+
|                        HEADER                             |
|  [Logo/Home]                    [User: Name | Disconnect] |
+------------+---------------------------------------------+
|  SIDEBAR   |              MAIN CONTENT                   |
|  (240px)   |              (flexible)                     |
|            |                                             |
|  [Home]    |  [SUBMOLT HEADER - if in submolt]          |
|            |                                             |
|  Submolts: |  [CREATE POST - expandable form]           |
|  - m/tech  |                                             |
|  - m/ai    |  [POST CARDS - feed of posts]              |
|            |                                             |
|  [+Create] |                                             |
+------------+---------------------------------------------+
```

---

## New Components to Create

```
src/components/
├── layout/
│   ├── MainLayout.tsx + .css    # App shell: sidebar + content
│   ├── Header.tsx + .css        # Top navigation bar
│   └── Sidebar.tsx + .css       # Left sidebar with submolt list
├── submolt/
│   ├── SubmoltList.tsx + .css   # List of submolts in sidebar
│   ├── SubmoltHeader.tsx + .css # Banner for submolt view
│   └── CreateSubmoltModal.tsx   # Modal for creating submolts
├── post/
│   ├── PostCard.tsx + .css      # Post preview in feed
│   ├── PostFeed.tsx + .css      # List of posts
│   ├── PostDetail.tsx + .css    # Full post with comments
│   └── CreatePostCard.tsx       # Inline post creation
├── comment/
│   ├── CommentThread.tsx + .css # Threaded comment display
│   ├── CommentItem.tsx + .css   # Single comment with reply
│   └── CommentEditor.tsx        # Inline comment form
└── common/
    └── Modal.tsx + .css         # Reusable modal
```

---

## New Context & Hooks

### NavigationContext
Manages current view state (home, submolt, post detail):
- `src/context/NavigationContext.tsx`

### New Hooks
- `src/hooks/useNavigation.ts` - Navigation helpers
- `src/hooks/usePosts.ts` - Fetch posts via GET /posts or GET /submolts/{name}/feed
- `src/hooks/usePost.ts` - Fetch single post via GET /posts/{id}
- `src/hooks/useCreateSubmolt.ts` - Create submolt via POST /submolts
- `src/hooks/useVote.ts` - Handle upvote/downvote on posts/comments

---

## Navigation Flow

1. **Home** -> Shows all submolts or default feed
2. Click **submolt** in sidebar -> Submolt feed (posts)
3. Click **post card** -> Post detail with comments
4. Click **Reply** on comment -> Inline reply editor
5. Click **Create Submolt** -> Modal form
6. Click **Create Post** -> Expandable form in feed

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Restructure to use MainLayout + NavigationContext |
| `src/App.css` | Update layout styles |
| `src/components/common/Button.css` | Change indigo (#4f46e5) to green (#16a34a) |
| `src/components/common/Input.css` | Change focus colors to green |
| `src/services/api.ts` | Add: getPosts(), getPost(), createSubmolt(), getSubmoltFeed(), upvotePost(), downvotePost(), subscribe(), unsubscribe() |
| `src/types/index.ts` | Add CreateSubmoltPayload, PostWithAuthor, extend Post type |

---

## Implementation Phases

### Phase 1: Layout & Colors
1. Create NavigationContext
2. Create MainLayout, Header, Sidebar components
3. Update color scheme to green across all CSS files
4. Restructure App.tsx to use new layout

### Phase 2: API Extensions
1. Add to api.ts: getPosts(), getPost(), getSubmoltFeed(), createSubmolt()
2. Add to api.ts: upvotePost(), downvotePost(), subscribe(), unsubscribe()
3. Add new types to types/index.ts

### Phase 3: Submolt Navigation
1. Create SubmoltList using getSubmolts()
2. Create SubmoltHeader component
3. Wire up navigation between home/submolt views

### Phase 4: Post Feed & Detail
1. Create PostCard, PostFeed components
2. Create PostDetail component
3. Create CreatePostCard (refactor from PostForm)
4. Add voting UI to posts

### Phase 5: Comments
1. Refactor CommentsViewer into CommentThread/CommentItem
2. Create inline CommentEditor for replies
3. Integrate comments into PostDetail view

### Phase 6: Create Submolt
1. Create reusable Modal component
2. Create CreateSubmoltModal
3. Add to sidebar "Create Submolt" button

---

## Verification

1. **Run dev server**: `npm run dev`
2. **Test navigation**: Click submolts in sidebar, verify view changes
3. **Test post creation**: Create post in a submolt
4. **Test comments**: View post, add comment, reply to comment
5. **Test create submolt**: Open modal, create new submolt
6. **Check responsiveness**: Resize window, verify mobile layout

---

## Current Codebase Structure (for reference)

```
src/
├── App.tsx              # Main app component
├── App.css              # Main styles
├── main.tsx             # React entry point
├── components/
│   ├── AgentConnect.tsx # Login page
│   ├── AgentProfile.tsx # User profile display
│   ├── PostForm.tsx     # Create post form
│   ├── CommentForm.tsx  # Add comment form
│   ├── ReplyForm.tsx    # Reply to comment form
│   ├── CommentsViewer.tsx # View comments tree
│   ├── SubmoltSelector.tsx # Submolt dropdown
│   ├── HelpPage.tsx     # Help documentation
│   └── common/
│       ├── Button.tsx + .css
│       ├── Input.tsx + .css
│       ├── Select.tsx + .css
│       └── Notification.tsx + .css
├── context/
│   ├── AuthContext.tsx  # Authentication state
│   └── NotificationContext.tsx # Toast notifications
├── hooks/
│   ├── useSubmolts.ts   # Fetch submolts
│   ├── useCreatePost.ts # Create post
│   ├── useCreateComment.ts # Create comment
│   └── useFetchComments.ts # Fetch comments
├── services/
│   └── api.ts           # API client
└── types/
    └── index.ts         # TypeScript types
```

---

## Resume Instructions

To continue implementation with a new Claude instance:
1. Share this file (REDDIT_UI_PLAN.md)
2. Say: "Please implement this Reddit-like UI plan for Moltbook"
3. Claude will follow the phases above to build the new UI
