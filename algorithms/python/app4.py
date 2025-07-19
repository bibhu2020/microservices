import streamlit as st
import pandas as pd
from sklearn.datasets import load_iris # load iris flowers datatset. basically the flower sepal and petal dimensions
from sklearn.ensemble import RandomForestClassifier # A machine learning model that perform classification task

st.title('A Machine Learning App Demo')

@st.cache
def load_data():
    iris = load_iris()
    df = pd.DataFrame(iris.data, columns=iris.feature_names)
    df['species'] = iris.target
    return df, iris.target_names 

df, target_names = load_data()

model=RandomForestClassifier()
model.fit(df.iloc[:, :-1], df['species'])

st.sidebar.header('Input Features')
sepal_length = st.sidebar.slider('Sepal Length', float(df['sepal length (cm)'].min()), float(df['sepal length (cm)'].max()))
sepal_width = st.sidebar.slider('Sepal Width', float(df['sepal width (cm)'].min()), float(df['sepal width (cm)'].max()))
petal_length = st.sidebar.slider('Petal Length', float(df['petal length (cm)'].min()), float(df['petal length (cm)'].max()))    
petal_width = st.sidebar.slider('Petal Width', float(df['petal width (cm)'].min()), float(df['petal width (cm)'].max()))

user_input = pd.DataFrame([[sepal_length, sepal_width, petal_length, petal_width]], columns=['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)'])
st.write(user_input)

if st.button('Predict'):
    prediction = model.predict(user_input)
    st.write(target_names[prediction[0]])
