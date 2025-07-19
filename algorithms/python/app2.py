import streamlit as st
import pandas as pd

# Inject Tailwind CSS using markdown
tailwind_cdn = """
<style>
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
</style>
"""
st.markdown(tailwind_cdn, unsafe_allow_html=True)

str.title("Streamlit Text Input:")

name=st.text_input("Enter your name:")

if name:
    st.write(f"Hello {name}!")

age=st.slider("Enter your age:", min_value=0, max_value=100, value=25)  

st.write(f"You are {age} years old.")   

st.write(f"Your name is {name} and you are {age} years old.")

options = ["Option 1", "Option 2", "Option 3"]
choice = st.selectbox("Select an option:", options)

st.write(f"You selected: {choice}")

data = {
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35],
    "City": ["New York", "San Francisco", "Los Angeles"]    
}

df = pd.DataFrame(data)
df.to_csv("example.csv", index=False)
st.write(df)    

uploaded_file = st.file_uploader("Choose a CSV file", type="csv")

if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)
    st.write(df)    

