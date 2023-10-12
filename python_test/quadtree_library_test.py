#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np

# Define parameters
n = 1000
width = 960
height = 500

# Generate random X and Y coordinates using normal distribution
mean_x = width / 2
std_dev_x = 80
x_coordinates = np.random.normal(mean_x, std_dev_x, n)
x_coordinates = np.clip(x_coordinates, 0, width)

mean_y = height / 2
std_dev_y = 80
y_coordinates = np.random.normal(mean_y, std_dev_y, n)
y_coordinates = np.clip(y_coordinates, 0, height)

# Generate uniform random values between 0 and 1
white_noise = np.random.uniform(0, 1, n)

# Create the data array
data = list(zip(x_coordinates, y_coordinates, white_noise))


# In[2]:


import quads

# Define the bounding box
bounding_box = quads.BoundingBox(0, 0, width, height) 

# Create a QuadTree with the specified bounding box
quadtree = quads.QuadTree((width/2, height/2), width, height)  #center_x, center_y, width, and height

# Insert data into the QuadTree
for i in range(len(data)):
    quadtree.insert(quads.Point(data[i][0], data[i][1]))  # Assuming data is a list of (x, y) pairs

# Search for points within the specified bounding box
results = quadtree.within_bb(bounding_box)

# Print the results
# for point in results:
#     print(point)

#print(results)


# In[3]:


for i in range(len(data)):
    x = data[i][0]
    y = data[i][1]
    print(x,y)
    break


# In[4]:


max(y_coordinates)


# In[5]:


quads.visualize(quadtree)


# In[ ]:




