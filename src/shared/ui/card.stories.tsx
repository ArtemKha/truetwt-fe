import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'
import { Button } from './button'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible card component with header, content, and footer sections.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

// Basic card
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
}

// Card with footer
export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Start building your next project with our easy-to-use tools.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
}

// Simple card
export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="p-6">
        <p>This is a simple card with just content.</p>
      </CardContent>
    </Card>
  ),
}

// Post-like card
export const PostCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            JD
          </div>
          <div>
            <CardTitle className="text-sm">@johndoe</CardTitle>
            <CardDescription className="text-xs">2 hours ago</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p>
          Just shipped a new feature! Really excited about how this turned out.
          What do you think?
        </p>
      </CardContent>
      <CardFooter className="pt-3">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <button className="hover:text-foreground" type="button">
            Reply
          </button>
          <button className="hover:text-foreground" type="button">
            Like
          </button>
          <button className="hover:text-foreground" type="button">
            Share
          </button>
        </div>
      </CardFooter>
    </Card>
  ),
}

// Multiple cards
export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>View your analytics dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Track your performance metrics and insights.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Update your profile and preferences.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <CardDescription>Get help when you need it</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contact our support team for assistance.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Manage your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <p>View and update your billing information.</p>
        </CardContent>
      </Card>
    </div>
  ),
}
