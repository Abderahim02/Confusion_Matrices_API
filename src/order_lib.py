import time
import numpy as np
import lap
from scipy.ndimage import uniform_filter1d


''' Applies a low pass filter to the current image'''
def low_pass_filter(image, filter_size_x, filter_size_y, wrap=False):
    
    mode = "wrap" if wrap else "reflect" # nearest
    
    im2 = uniform_filter1d(image, filter_size_y, axis=0, mode=mode)  
    im2 = uniform_filter1d(im2, filter_size_x, axis=1, mode=mode)  
    return im2


''' Calculates the squared L2 (eucldean) distance using numpy. '''
def squared_l2_distance(q, p):
    
    ps = np.sum(p*p, axis=-1, keepdims=True)    
    qs = np.sum(q*q, axis=-1, keepdims=True)
    distance = ps - 2*np.matmul(p, q.T) + qs.T
    return np.clip(distance, 0, np.inf)


def sort_with_las(X, radius_factor = 0.9, wrap = False):
    
    # for reproducible sortings
    np.random.seed(7)  
    
    # setup of required variables
    N = np.prod(X.shape[:-1])
    grid_shape = X.shape[:-1]
    H, W = grid_shape
    start_time = time.time()
    
    # assign input vectors to random positions on the grid
    grid = np.random.permutation(X.reshape((N, -1))).reshape((X.shape)).astype(float)
    
    # reshape 2D grid to 1D
    flat_X = X.reshape((N, -1))
    
    radius_f = max(H, W)/2 - 1 
    
    while True:
        print(".", end="")
        # compute filtersize that is not larger than any side of the grid
        radius = int(np.round(radius_f))
        
        filter_size_x = min(W-1, int(2*radius + 1))
        filter_size_y = min(H-1, int(2*radius + 1))
        #print (f"radius {radius_f:.2f} Filter size: {filter_size_x}")
        
        # Filter the map vectors using the actual filter radius
        grid = low_pass_filter(grid, filter_size_x, filter_size_y, wrap=wrap)
        flat_grid = grid.reshape((N, -1))
              
        # calc C
        pixels = flat_X
        grid_vecs = flat_grid
        C = squared_l2_distance(pixels, grid_vecs)
        # quantization of distances speeds up assigment solver
        C = (C / C.max() * 2048).astype(int)
        
        # get indices of best assignements 
        _, best_perm_indices, _= lap.lapjv(C)
        
        #Assign the input vectors to their new map positions in 1D
        flat_X = pixels[best_perm_indices]
        
        # prepare variables for next iteration
        grid = flat_X.reshape(X.shape)
        
        radius_f *= radius_factor
        if radius_f < 1:
            break
                
    print(f"\nSorted with LAS in {time.time() - start_time:.3f} seconds") 
    
    # return sorted grid
    return grid


def order_matrix(matrix_list):
    return sorted(matrix_list, key=lambda x: x[0])


def order_matrix_reverse(matrix_list):
    return sorted(matrix_list, key=lambda x: x[0], reverse=True)