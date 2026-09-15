import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else {
      return
    }

    let appDelegate = UIApplication.shared.delegate as? AppDelegate
    let rnDelegate = appDelegate?.reactNativeDelegate ?? ReactNativeDelegate()
    rnDelegate.dependencyProvider = RCTAppDependencyProvider()
    let factory = appDelegate?.reactNativeFactory ?? RCTReactNativeFactory(delegate: rnDelegate)

    reactNativeDelegate = rnDelegate
    reactNativeFactory = factory
    appDelegate?.reactNativeDelegate = rnDelegate
    appDelegate?.reactNativeFactory = factory

    let window = UIWindow(windowScene: windowScene)
    factory.startReactNative(
      withModuleName: "HelloWorld",
      in: window,
      launchOptions: appDelegate?.launchOptions
    )
    self.window = window
    appDelegate?.window = window
  }
}
