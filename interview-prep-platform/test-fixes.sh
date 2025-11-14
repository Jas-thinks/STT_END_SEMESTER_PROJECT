#!/bin/bash

echo "=== Testing Bug Fixes ==="
echo ""

echo "1. Testing SQL questions (was failing before):"
curl -s "http://localhost:5000/api/quiz/questions?subject=SQL&difficulty=easy&count=3" | jq '.success, .message, (.data | length)' 2>/dev/null || echo "Server might not be running on port 5000"
echo ""

echo "2. Testing DBMS questions (was failing before):"
curl -s "http://localhost:5000/api/quiz/questions?subject=DBMS&difficulty=easy&count=3" | jq '.success, .message, (.data | length)' 2>/dev/null || echo "Server might not be running on port 5000"
echo ""

echo "3. Testing DSA questions (was working before, should still work):"
curl -s "http://localhost:5000/api/quiz/questions?subject=DSA&difficulty=easy&count=3" | jq '.success, .message, (.data | length)' 2>/dev/null || echo "Server might not be running on port 5000"
echo ""

echo "4. Testing accurate question counts:"
curl -s "http://localhost:5000/api/quiz/categories" | jq '.data[] | {name: .name, difficulties: .difficulties}' 2>/dev/null | head -30 || echo "Server might not be running on port 5000"
echo ""

echo "=== Tests Complete ==="
