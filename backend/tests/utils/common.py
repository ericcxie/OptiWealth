import time


def time_function(func, *args, **kwargs):
    start_time = time.time()
    func(*args, **kwargs)
    end_time = time.time()

    elapsed_time = end_time - start_time
    print(f"Time taken for {func.__name__}: {elapsed_time} seconds")

    return elapsed_time
