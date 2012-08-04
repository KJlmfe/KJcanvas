void push(x)
{
	stack[top] = x;
	top++;
}

int pop()
{
	top--;
	return stack[top];
}
