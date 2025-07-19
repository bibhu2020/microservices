### It's a web application built on streamlit

from tkinter import Image
import streamlit as st
import pandas as pd
import numpy as np

st.title('Hello Streamlit!!!')

## Display simple text
st.write('This is a simple text')

## Create a simple dataframe
df = pd.DataFrame({
    'first column': [1, 2, 3, 4],
    'second column': [10, 20, 30, 40]
})

## Display the dataframe
st.write("Here is a dataframe:")
st.write(df)

## Display a plot
chart_data = pd.DataFrame(
    np.random.randn(20, 3),
    columns=['a', 'b', 'c'])

st.write("Here is a plot:")
st.line_chart(chart_data)
st.line_chart(df)

# ## Display an image
# img = Image.open('image.jpg')
# st.image(img)   