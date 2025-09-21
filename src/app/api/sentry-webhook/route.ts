import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { headers } from 'next/headers'

/**
 * Sentry Webhook Handler
 * Receives notifications from Sentry about errors and issues
 * Can be used to trigger additional actions like Slack notifications
 */

interface SentryWebhookPayload {
  action: string
  data: {
    issue?: {
      id: string
      title: string
      culprit: string
      level: string
      status: string
      statusDetails: any
      count: string
      userCount: number
      project: {
        id: string
        name: string
        slug: string
      }
      permalink: string
    }
    event?: {
      id: string
      title: string
      message: string
      level: string
      platform: string
      timestamp: string
      environment: string
      release: string
      user?: {
        id: string
        email: string
      }
    }
  }
  actor: {
    id: string
    name: string
    type: string
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (optional but recommended)
    const headersList = await headers()
    const signature = headersList.get('sentry-hook-signature')
    
    // You can verify the signature here if you set up a webhook secret
    // const isValidSignature = verifySignature(signature, body, secret)
    
    const payload: SentryWebhookPayload = await request.json()
    
    // Log webhook received
    console.log('📨 Sentry webhook received:', {
      action: payload.action,
      issueId: payload.data.issue?.id,
      eventId: payload.data.event?.id,
    })

    // Handle different webhook actions
    switch (payload.action) {
      case 'issue.created':
        await handleNewIssue(payload.data.issue!)
        break
        
      case 'issue.resolved':
        await handleResolvedIssue(payload.data.issue!)
        break
        
      case 'issue.assigned':
        await handleAssignedIssue(payload.data.issue!)
        break
        
      case 'event.alert':
        await handleErrorAlert(payload.data.event!)
        break
        
      default:
        console.log(`📝 Unhandled Sentry webhook action: ${payload.action}`)
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Sentry webhook error:', error)
    
    // Don't capture webhook errors in Sentry to avoid loops
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle new issue creation
 */
async function handleNewIssue(issue: SentryWebhookPayload['data']['issue']) {
  if (!issue) return

  console.log('🚨 New Sentry issue created:', {
    id: issue.id,
    title: issue.title,
    level: issue.level,
    userCount: issue.userCount,
    count: issue.count,
  })

  // Critical error handling
  if (issue.level === 'error' && issue.userCount > 10) {
    console.log('🔥 Critical error affecting many users!')
    
    // Here you could:
    // 1. Send Slack notification
    // 2. Create GitHub issue
    // 3. Send email to dev team
    // 4. Trigger incident response
    
    await sendCriticalErrorNotification(issue)
  }

  // High frequency error handling
  if (parseInt(issue.count) > 100) {
    console.log('📈 High frequency error detected!')
    
    await sendHighFrequencyErrorNotification(issue)
  }
}

/**
 * Handle issue resolution
 */
async function handleResolvedIssue(issue: SentryWebhookPayload['data']['issue']) {
  if (!issue) return

  console.log('✅ Sentry issue resolved:', {
    id: issue.id,
    title: issue.title,
  })

  // Here you could:
  // 1. Update internal tracking
  // 2. Notify stakeholders
  // 3. Update documentation
  // 4. Close related tickets
}

/**
 * Handle issue assignment
 */
async function handleAssignedIssue(issue: SentryWebhookPayload['data']['issue']) {
  if (!issue) return

  console.log('👤 Sentry issue assigned:', {
    id: issue.id,
    title: issue.title,
  })

  // Here you could:
  // 1. Notify assigned developer
  // 2. Update project management tools
  // 3. Set priority flags
  // 4. Create calendar reminders
}

/**
 * Handle error alerts (threshold-based)
 */
async function handleErrorAlert(event: SentryWebhookPayload['data']['event']) {
  if (!event) return

  console.log('⚠️ Sentry error alert triggered:', {
    id: event.id,
    title: event.title,
    level: event.level,
    environment: event.environment,
  })

  // Here you could:
  // 1. Send immediate notifications
  // 2. Trigger incident response
  // 3. Scale infrastructure
  // 4. Enable maintenance mode
}

/**
 * Send critical error notification
 */
async function sendCriticalErrorNotification(issue: SentryWebhookPayload['data']['issue']) {
  // Example: Send to Slack, email, or other notification service
  console.log('📢 Sending critical error notification for:', issue.title)
  
  // Implementation would depend on your notification service
  // Example: Slack webhook, email service, PagerDuty, etc.
  
  const notificationData = {
    text: `🚨 Critical Error in Second Turn Games`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Critical Error Detected*\n\n*Issue:* ${issue.title}\n*Users Affected:* ${issue.userCount}\n*Occurrences:* ${issue.count}\n*Level:* ${issue.level}\n\n<${issue.permalink}|View in Sentry>`
        }
      }
    ]
  }
  
  // Send notification (implement based on your service)
  // await fetch(process.env.SLACK_WEBHOOK_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(notificationData)
  // })
}

/**
 * Send high frequency error notification
 */
async function sendHighFrequencyErrorNotification(issue: SentryWebhookPayload['data']['issue']) {
  console.log('📊 Sending high frequency error notification for:', issue.title)
  
  // Implementation for high frequency error alerts
  // This might be less urgent than critical errors
}

/**
 * Verify webhook signature (optional security measure)
 */
function verifySignature(signature: string | null, body: string, secret: string): boolean {
  if (!signature || !secret) return false
  
  // Implement signature verification based on Sentry's webhook security
  // This prevents unauthorized webhook calls
  
  return true // Placeholder - implement actual verification
}
