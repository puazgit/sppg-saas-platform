/**
 * Integration Test Dashboard Component
 * Displays subscription flow integration test results and analytics
 */

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  BarChart3,
  FileText,
  Zap
} from 'lucide-react'

import { 
  IntegrationTestResult, 
  useSubscriptionFlowTesting 
} from '../lib/subscription-flow-integration'

interface IntegrationTestDashboardProps {
  className?: string
}

export function IntegrationTestDashboard({ className }: IntegrationTestDashboardProps) {
  const { testResults, isRunning, runTests } = useSubscriptionFlowTesting()
  const [selectedTest, setSelectedTest] = useState<IntegrationTestResult | null>(null)

  const passedTests = testResults.filter(r => r.passed)
  const failedTests = testResults.filter(r => !r.passed)
  const avgScore = testResults.length > 0 
    ? testResults.reduce((sum, r) => sum + r.results.integrationScore, 0) / testResults.length 
    : 0
  const totalExecutionTime = testResults.reduce((sum, r) => sum + r.executionTime, 0)

  const handleRunTests = async () => {
    await runTests()
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Subscription Flow Integration Testing
            </div>
            <Button
              onClick={handleRunTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {isRunning ? 'Running Tests...' : 'Run Integration Tests'}
            </Button>
          </CardTitle>
          <CardDescription>
            Comprehensive end-to-end testing for subscription flow with package validation and payment integration
          </CardDescription>
        </CardHeader>

        {testResults.length > 0 && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {passedTests.length}
                </div>
                <div className="text-sm text-muted-foreground">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {failedTests.length}
                </div>
                <div className="text-sm text-muted-foreground">Tests Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {avgScore.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {totalExecutionTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress 
                value={(passedTests.length / testResults.length) * 100} 
                className="h-3"
              />
              <div className="text-center text-sm text-muted-foreground mt-2">
                Success Rate: {((passedTests.length / testResults.length) * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {testResults.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              {testResults.map((result, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-colors ${
                    selectedTest?.testName === result.testName 
                      ? 'ring-2 ring-blue-500' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTest(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-medium">{result.testName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Integration Score: {result.results.integrationScore}/100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={result.passed ? 'default' : 'destructive'}>
                          {result.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.executionTime.toFixed(1)}ms
                        </div>
                      </div>
                    </div>

                    {result.errors.length > 0 && (
                      <Alert variant="destructive" className="mt-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Errors ({result.errors.length})</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-4 mt-1">
                            {result.errors.slice(0, 2).map((error, idx) => (
                              <li key={idx} className="text-sm">{error}</li>
                            ))}
                          </ul>
                          {result.errors.length > 2 && (
                            <p className="text-xs mt-1">
                              +{result.errors.length - 2} more errors
                            </p>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    {result.warnings.length > 0 && (
                      <Alert className="mt-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warnings ({result.warnings.length})</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-4 mt-1">
                            {result.warnings.slice(0, 2).map((warning, idx) => (
                              <li key={idx} className="text-sm">{warning}</li>
                            ))}
                          </ul>
                          {result.warnings.length > 2 && (
                            <p className="text-xs mt-1">
                              +{result.warnings.length - 2} more warnings
                            </p>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {selectedTest ? (
              <TestDetailView test={selectedTest} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a test from the overview to see detailed results
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <TestAnalytics testResults={testResults} />
          </TabsContent>
        </Tabs>
      )}

      {testResults.length === 0 && !isRunning && (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Test Results</h3>
            <p className="text-muted-foreground mb-4">
              Run integration tests to see comprehensive subscription flow analysis
            </p>
            <Button onClick={handleRunTests}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Integration Tests
            </Button>
          </CardContent>
        </Card>
      )}

      {isRunning && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Running Integration Tests</h3>
            <p className="text-muted-foreground">
              Testing subscription flow components and validating end-to-end integration...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface TestDetailViewProps {
  test: IntegrationTestResult
}

function TestDetailView({ test }: TestDetailViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{test.testName}</span>
          <Badge variant={test.passed ? 'default' : 'destructive'}>
            {test.passed ? 'PASSED' : 'FAILED'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{test.results.integrationScore}</div>
            <div className="text-sm text-muted-foreground">Integration Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{test.executionTime.toFixed(1)}ms</div>
            <div className="text-sm text-muted-foreground">Execution Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{test.errors.length}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{test.warnings.length}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
        </div>

        <Progress value={test.results.integrationScore} className="h-3" />

        {/* Errors */}
        {test.errors.length > 0 && (
          <div>
            <h4 className="font-medium text-red-600 mb-3">Errors</h4>
            <div className="space-y-2">
              {test.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {test.warnings.length > 0 && (
          <div>
            <h4 className="font-medium text-yellow-600 mb-3">Warnings</h4>
            <div className="space-y-2">
              {test.warnings.map((warning, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{warning}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Test Results */}
        <div>
          <h4 className="font-medium mb-3">Component Results</h4>
          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span>Registration Validation</span>
              <Badge variant={test.results.registrationValidation ? 'default' : 'secondary'}>
                {test.results.registrationValidation ? 'Executed' : 'Failed'}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span>Package Validation</span>
              <Badge variant={test.results.packageValidation ? 'default' : 'secondary'}>
                {test.results.packageValidation ? 'Executed' : 'Failed'}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span>Payment Calculation</span>
              <Badge variant={test.results.paymentCalculation ? 'default' : 'secondary'}>
                {test.results.paymentCalculation ? 'Executed' : 'Failed'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TestAnalyticsProps {
  testResults: IntegrationTestResult[]
}

function TestAnalytics({ testResults }: TestAnalyticsProps) {
  const totalTests = testResults.length
  const passedTests = testResults.filter(r => r.passed).length
  const failedTests = totalTests - passedTests
  const avgScore = totalTests > 0 
    ? testResults.reduce((sum, r) => sum + r.results.integrationScore, 0) / totalTests 
    : 0
  const avgExecutionTime = totalTests > 0
    ? testResults.reduce((sum, r) => sum + r.executionTime, 0) / totalTests
    : 0

  // Calculate component success rates
  const registrationSuccess = testResults.filter(r => r.results.registrationValidation).length
  const packageSuccess = testResults.filter(r => r.results.packageValidation).length
  const paymentSuccess = testResults.filter(r => r.results.paymentCalculation).length

  return (
    <div className="grid gap-6">
      {/* Overall Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Test Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalTests}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {((passedTests / totalTests) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {avgScore.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Integration Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {avgExecutionTime.toFixed(1)}ms
              </div>
              <div className="text-sm text-muted-foreground">Avg Execution Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Success Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Component Success Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Registration Validation</span>
              <span>{((registrationSuccess / totalTests) * 100).toFixed(1)}%</span>
            </div>
            <Progress value={(registrationSuccess / totalTests) * 100} />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span>Package Validation</span>
              <span>{((packageSuccess / totalTests) * 100).toFixed(1)}%</span>
            </div>
            <Progress value={(packageSuccess / totalTests) * 100} />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span>Payment Calculation</span>
              <span>{((paymentSuccess / totalTests) * 100).toFixed(1)}%</span>
            </div>
            <Progress value={(paymentSuccess / totalTests) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-3">Passed Tests ({passedTests})</h4>
              <div className="space-y-2">
                {testResults
                  .filter(r => r.passed)
                  .map((result, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="truncate">{result.testName}</span>
                      <span className="text-green-600">{result.results.integrationScore}/100</span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-red-600 mb-3">Failed Tests ({failedTests})</h4>
              <div className="space-y-2">
                {testResults
                  .filter(r => !r.passed)
                  .map((result, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="truncate">{result.testName}</span>
                      <span className="text-red-600">{result.results.integrationScore}/100</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IntegrationTestDashboard