# Website Showcase Application

A comprehensive web application for showcasing and comparing websites across different device sizes. This tool allows users to add, view, update, and delete website entries, generate screenshots for different device sizes, and compare manus and intern versions of websites.

## Features

### Website Management
- **Create**: Add new website entries with manus URL, intern URL, or both
- **Read**: Browse and view existing website entries with screenshots
- **Update**: Edit website information and regenerate screenshots
- **Delete**: Remove websites from the showcase

### Screenshot Generation
- Automatic screenshot generation for different device sizes:
  - Mobile (320px-480px)
  - Tablet (481px-768px)
  - Laptop (769px-1024px)
  - Desktop (1025px and above)
- Visual comparison between manus and intern versions

### Responsive Design
- Fully responsive interface that works across all device sizes
- Device-specific optimizations for optimal viewing experience
- Adaptive layout that changes based on screen size

### User Experience
- Intuitive interface with clear navigation
- Real-time feedback for user actions
- Loading states and error handling
- Search and filter functionality

### Performance Optimizations
- Lazy loading for screenshots
- Optimized CSS and JavaScript
- Efficient DOM manipulation
- Event delegation for better performance

### Accessibility
- Keyboard navigation support
- ARIA attributes for screen readers
- Semantic HTML structure
- Visible focus indicators

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Supabase (PostgreSQL)
- **Screenshot Generation**: ScrapFly API
- **Styling**: Custom CSS with responsive design principles
- **Version Control**: Git

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Supabase account
- ScrapFly API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/website-showcase.git
cd website-showcase
```

2. Configure environment variables:
   - Create a `.env` file in the project root
   - Add your Supabase and ScrapFly API keys:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SCRAPFLY_API_KEY=your_scrapfly_api_key
```

3. Update the API keys in the code:
   - In `supabase.js`, replace the placeholder values with your actual Supabase credentials
   - In `screenshot-service.js`, replace the placeholder API key with your ScrapFly API key

4. Serve the application:
   - You can use any static file server like `http-server` or `live-server`
   - For example, with `http-server`:
```bash
npm install -g http-server
http-server
```

5. Access the application:
   - Open your browser and navigate to `http://localhost:8080`

### Database Setup

The application requires the following tables in your Supabase database:

1. **websites**:
```sql
CREATE TABLE websites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  manus_url TEXT NOT NULL,
  intern_url TEXT,
  prompt TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  user_id UUID REFERENCES auth.users(id),
  is_featured BOOLEAN DEFAULT false,
  screenshot_desktop TEXT,
  screenshot_tablet TEXT,
  screenshot_mobile TEXT,
  manus_screenshot_desktop TEXT,
  manus_screenshot_tablet TEXT,
  manus_screenshot_mobile TEXT,
  intern_screenshot_desktop TEXT,
  intern_screenshot_tablet TEXT,
  intern_screenshot_mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **categories**:
```sql
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage Examples

### Adding a New Website

1. Fill out the "Add New Website" form with the following information:
   - manus URL (required)
   - intern URL (optional)
   - Website Title
   - Prompt used to generate the website
   - Description (optional)
   - Category (optional)
   - Tags (optional, comma-separated)

2. Click "Add Website" to submit the form
3. The application will automatically generate screenshots for different device sizes
4. Once processing is complete, the new website will appear in the gallery

### Comparing Websites

1. Browse the website gallery to find entries with both manus and intern URLs
2. Click the "Compare" button on the website card
3. In the comparison view, you can:
   - Switch between different device sizes using the device buttons
   - View both versions side-by-side
   - Click "Visit manus Site" or "Visit intern Site" to open the actual websites

### Filtering and Sorting

1. Use the category tabs to filter websites by category
2. Use the sort dropdown to change the order (Newest First, Oldest First, Title A-Z)
3. Use the view switcher to toggle between grid and list views

## Troubleshooting

### Screenshots Not Loading
- Check your ScrapFly API key and usage limits
- Verify that the website URLs are accessible and not behind authentication
- Check browser console for specific error messages

### Database Connection Issues
- Verify your Supabase credentials
- Check if the required tables exist with the correct structure
- Ensure your Supabase project has the appropriate permissions set

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.