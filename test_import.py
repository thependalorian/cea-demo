import sys
print("Python executable:", sys.executable)
print("Python path:")
for p in sys.path:
    print(f"  - {p}")

print("\nTrying to import pydantic_agent:")
try:
    import pydantic_agent
    print(f"Success! Found at {pydantic_agent.__file__}")
except ImportError as e:
    print(f"Error: {e}")

print("\nChecking sys.modules for pydantic_agent:")
if 'pydantic_agent' in sys.modules:
    print(f"pydantic_agent is in sys.modules at {sys.modules['pydantic_agent'].__file__}")
else:
    print("pydantic_agent is not in sys.modules") 