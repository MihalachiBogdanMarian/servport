import matplotlib.pyplot as plt
import numpy as np

print("Welcome to ServPort")

x = np.linspace(0, 20, 100)  # create a list of evenly-spaced numbers over the range
plt.plot(x, np.sin(x))  # plot the sine of each x point
plt.show()  # display the plot
