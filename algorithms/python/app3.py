import streamlit as st

# Sample blogs (title, content, author)
BLOGS = [
    {"title": "Exploring AI in 2025", "content": "AI is evolving rapidly, shaping industries like healthcare, finance, and more...", "author": "Alice"},
    {"title": "Python for Beginners", "content": "Python is a great language to start coding. Let's dive into basics...", "author": "Bob"},
    {"title": "Cloud Computing Trends", "content": "Cloud is changing how businesses operate. Hybrid cloud is the new norm...", "author": "Charlie"},
    {"title": "Understanding Blockchain", "content": "Blockchain is not just for cryptocurrencies. Learn about its real-world use cases...", "author": "Dave"},
    {"title": "Web Development in 2025", "content": "JavaScript frameworks are continuously evolving. What’s next for web dev?", "author": "Eve"},
]

# Set default number of displayed blogs
DEFAULT_BLOGS_COUNT = 3
if "blog_count" not in st.session_state:
    st.session_state.blog_count = DEFAULT_BLOGS_COUNT

# Page Title
st.title("📖 My Blogging Website")

# Description
st.write("Welcome to the blogging platform! Here are some latest blogs:")

# Display blogs dynamically
for i in range(min(st.session_state.blog_count, len(BLOGS))):
    blog = BLOGS[i]
    st.subheader(blog["title"])
    st.write(f"✍️ *By {blog['author']}*")
    st.write(blog["content"])
    st.markdown("---")

# "Load More" button logic
if st.session_state.blog_count < len(BLOGS):
    if st.button("Load More Blogs"):
        st.session_state.blog_count += 1  # Increase the count

# Footer
st.markdown("📝 *A simple blogging app built with Streamlit*")
