Feature: E2E - Purchase Flow

    As a user
    I want to be able to add a product to my basket
    so that I can checkout

    Background: Go to home page and accept cookie
        Given the user navigates to '/'
        When the url contains '/'
        Then the user clicks on 'reject_cookie_btn'

    @amazon-purchase-flow @e2e
    Scenario Outline: <id> - Verify that the user can purchase '<product>'
        Given the user search for '<product>'
        And the user add the first 3 results that qualify for Prime delivery
        When the user modify the quanity of one item
        And the total value is correct
        And the user clicks on 'process_to_checkout_btn'
        Then the url contains '/ap/signin'
        Examples:
            | id    | product     |
            | TC_01 | apple watch |
            | TC_02 | iphone 14   |
            | TC_03 | macbook pro |

    @amazon-purchase-flow @accessibility
    Scenario: TC_04 - Verify that the home page has the right title
        Then the title of the page should contains "Amazon.co.uk: Low Prices in Electronics, Books, Sports Equipment & more"

    @amazon-purchase-flow @accessibility
    Scenario Outline: <id> - Verify that all <element> on the home page contains <tag>
        Then the field '<element>' should contain '<tag>' tag
        Examples:
            | id    | element | tag  |
            | TC_05 | img     | alt  |
            | TC_06 | link    | href |



