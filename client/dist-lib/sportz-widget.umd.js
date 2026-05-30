(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("react")) : typeof define === "function" && define.amd ? define(["exports", "react"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.SportZWidget = {}, global.React));
})(this, function(exports, react) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	//#endregion
	react = __toESM(react, 1);
	//#region node_modules/react/cjs/react-jsx-runtime.production.js
	/**
	* @license React
	* react-jsx-runtime.production.js
	*
	* Copyright (c) Meta Platforms, Inc. and affiliates.
	*
	* This source code is licensed under the MIT license found in the
	* LICENSE file in the root directory of this source tree.
	*/
	var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
		var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
		function jsxProd(type, config, maybeKey) {
			var key = null;
			void 0 !== maybeKey && (key = "" + maybeKey);
			void 0 !== config.key && (key = "" + config.key);
			if ("key" in config) {
				maybeKey = {};
				for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
			} else maybeKey = config;
			config = maybeKey.ref;
			return {
				$$typeof: REACT_ELEMENT_TYPE,
				type,
				key,
				ref: void 0 !== config ? config : null,
				props: maybeKey
			};
		}
		exports.Fragment = REACT_FRAGMENT_TYPE;
		exports.jsx = jsxProd;
		exports.jsxs = jsxProd;
	}));
	//#endregion
	//#region node_modules/react/cjs/react-jsx-runtime.development.js
	/**
	* @license React
	* react-jsx-runtime.development.js
	*
	* Copyright (c) Meta Platforms, Inc. and affiliates.
	*
	* This source code is licensed under the MIT license found in the
	* LICENSE file in the root directory of this source tree.
	*/
	var require_react_jsx_runtime_development = /* @__PURE__ */ __commonJSMin(((exports) => {
		"production" !== process.env.NODE_ENV && (function() {
			function getComponentNameFromType(type) {
				if (null == type) return null;
				if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
				if ("string" === typeof type) return type;
				switch (type) {
					case REACT_FRAGMENT_TYPE: return "Fragment";
					case REACT_PROFILER_TYPE: return "Profiler";
					case REACT_STRICT_MODE_TYPE: return "StrictMode";
					case REACT_SUSPENSE_TYPE: return "Suspense";
					case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
					case REACT_ACTIVITY_TYPE: return "Activity";
				}
				if ("object" === typeof type) switch ("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
					case REACT_PORTAL_TYPE: return "Portal";
					case REACT_CONTEXT_TYPE: return type.displayName || "Context";
					case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
					case REACT_FORWARD_REF_TYPE:
						var innerType = type.render;
						type = type.displayName;
						type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
						return type;
					case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
					case REACT_LAZY_TYPE:
						innerType = type._payload;
						type = type._init;
						try {
							return getComponentNameFromType(type(innerType));
						} catch (x) {}
				}
				return null;
			}
			function testStringCoercion(value) {
				return "" + value;
			}
			function checkKeyStringCoercion(value) {
				try {
					testStringCoercion(value);
					var JSCompiler_inline_result = !1;
				} catch (e) {
					JSCompiler_inline_result = !0;
				}
				if (JSCompiler_inline_result) {
					JSCompiler_inline_result = console;
					var JSCompiler_temp_const = JSCompiler_inline_result.error;
					var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
					JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
					return testStringCoercion(value);
				}
			}
			function getTaskName(type) {
				if (type === REACT_FRAGMENT_TYPE) return "<>";
				if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
				try {
					var name = getComponentNameFromType(type);
					return name ? "<" + name + ">" : "<...>";
				} catch (x) {
					return "<...>";
				}
			}
			function getOwner() {
				var dispatcher = ReactSharedInternals.A;
				return null === dispatcher ? null : dispatcher.getOwner();
			}
			function UnknownOwner() {
				return Error("react-stack-top-frame");
			}
			function hasValidKey(config) {
				if (hasOwnProperty.call(config, "key")) {
					var getter = Object.getOwnPropertyDescriptor(config, "key").get;
					if (getter && getter.isReactWarning) return !1;
				}
				return void 0 !== config.key;
			}
			function defineKeyPropWarningGetter(props, displayName) {
				function warnAboutAccessingKey() {
					specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
				}
				warnAboutAccessingKey.isReactWarning = !0;
				Object.defineProperty(props, "key", {
					get: warnAboutAccessingKey,
					configurable: !0
				});
			}
			function elementRefGetterWithDeprecationWarning() {
				var componentName = getComponentNameFromType(this.type);
				didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
				componentName = this.props.ref;
				return void 0 !== componentName ? componentName : null;
			}
			function ReactElement(type, key, props, owner, debugStack, debugTask) {
				var refProp = props.ref;
				type = {
					$$typeof: REACT_ELEMENT_TYPE,
					type,
					key,
					props,
					_owner: owner
				};
				null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
					enumerable: !1,
					get: elementRefGetterWithDeprecationWarning
				}) : Object.defineProperty(type, "ref", {
					enumerable: !1,
					value: null
				});
				type._store = {};
				Object.defineProperty(type._store, "validated", {
					configurable: !1,
					enumerable: !1,
					writable: !0,
					value: 0
				});
				Object.defineProperty(type, "_debugInfo", {
					configurable: !1,
					enumerable: !1,
					writable: !0,
					value: null
				});
				Object.defineProperty(type, "_debugStack", {
					configurable: !1,
					enumerable: !1,
					writable: !0,
					value: debugStack
				});
				Object.defineProperty(type, "_debugTask", {
					configurable: !1,
					enumerable: !1,
					writable: !0,
					value: debugTask
				});
				Object.freeze && (Object.freeze(type.props), Object.freeze(type));
				return type;
			}
			function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
				var children = config.children;
				if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
					for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++) validateChildKeys(children[isStaticChildren]);
					Object.freeze && Object.freeze(children);
				} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
				else validateChildKeys(children);
				if (hasOwnProperty.call(config, "key")) {
					children = getComponentNameFromType(type);
					var keys = Object.keys(config).filter(function(k) {
						return "key" !== k;
					});
					isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
					didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
				}
				children = null;
				void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
				hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
				if ("key" in config) {
					maybeKey = {};
					for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
				} else maybeKey = config;
				children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
				return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
			}
			function validateChildKeys(node) {
				isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
			}
			function isValidElement(object) {
				return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
			}
			var React = require("react"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
				return null;
			};
			React = { react_stack_bottom_frame: function(callStackForError) {
				return callStackForError();
			} };
			var specialPropKeyWarningShown;
			var didWarnAboutElementRef = {};
			var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
			var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
			var didWarnAboutKeySpread = {};
			exports.Fragment = REACT_FRAGMENT_TYPE;
			exports.jsx = function(type, config, maybeKey) {
				var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
				return jsxDEVImpl(type, config, maybeKey, !1, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
			};
			exports.jsxs = function(type, config, maybeKey) {
				var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
				return jsxDEVImpl(type, config, maybeKey, !0, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
			};
		})();
	}));
	//#endregion
	//#region src/components/AdSenseAd.jsx
	var import_jsx_runtime = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
		if (process.env.NODE_ENV === "production") module.exports = require_react_jsx_runtime_production();
		else module.exports = require_react_jsx_runtime_development();
	})))();
	/**
	* Premium Google AdSense Component
	* 
	* Renders a responsive Google AdSense ad unit.
	* 
	* Features:
	* - Dynamic AdSense script injection using Vite environment variables.
	* - Graceful fallback: If the AdSense script fails, gets blocked by an ad-blocker, 
	*   or if no Publisher ID is set, it displays a gorgeous, premium, glassmorphism 
	*   ad placeholder in development/preview mode instead of breaking.
	* - Supports custom styling, slot IDs, and layout configurations.
	*/
	function AdSenseAd({ slot = "1234567890", client = null, format = "auto", responsive = "true", style = { display: "block" }, className = "", height = "120px", licenseKey = null }) {
		const [adBlocked, setAdBlocked] = (0, react.useState)(false);
		const [isLoaded, setIsLoaded] = (0, react.useState)(false);
		const [adsEnabled, setAdsEnabled] = (0, react.useState)(true);
		const [dynamicClient, setDynamicClient] = (0, react.useState)(null);
		(0, react.useEffect)(() => {
			const loadSettings = async () => {
				try {
					const url = `${window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin}/api/settings${licenseKey ? `?licenseKey=${encodeURIComponent(licenseKey)}` : ""}`;
					const res = await fetch(url);
					if (res.ok) {
						const data = await res.json();
						setAdsEnabled(data.adsEnabled);
						if (data.adClient) setDynamicClient(data.adClient);
					}
				} catch (err) {
					console.warn("Dynamic settings fetch failed:", err);
				}
			};
			loadSettings();
		}, [licenseKey]);
		const publisherId = client || dynamicClient || "ca-pub-4370867821860158";
		const isDev = !publisherId;
		(0, react.useEffect)(() => {
			if (!publisherId) {
				setIsLoaded(true);
				return;
			}
			const scriptId = "google-adsense-script";
			let script = document.getElementById(scriptId);
			if (!script) {
				script = document.createElement("script");
				script.id = scriptId;
				script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
				script.async = true;
				script.crossOrigin = "anonymous";
				script.onload = () => {
					console.log("Google AdSense script loaded successfully.");
					initializeAd();
				};
				script.onerror = () => {
					console.warn("Failed to load Google AdSense. Script might be blocked by an ad-blocker.");
					setAdBlocked(true);
				};
				document.head.appendChild(script);
			} else initializeAd();
		}, [publisherId, slot]);
		const initializeAd = () => {
			try {
				setTimeout(() => {
					if (window.adsbygoogle) {
						(window.adsbygoogle = window.adsbygoogle || []).push({});
						setIsLoaded(true);
					} else setAdBlocked(true);
				}, 100);
			} catch (e) {
				console.warn("Google AdSense initialization error:", e);
				setAdBlocked(true);
			}
		};
		if (!adsEnabled) return null;
		if (isDev || adBlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `glass-panel ${className}`,
			style: {
				minHeight: height,
				background: "rgba(255, 255, 255, 0.4)",
				border: "1px dashed rgba(79, 70, 229, 0.4)",
				borderRadius: "12px",
				padding: "16px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
				gap: "6px",
				position: "relative",
				overflow: "hidden",
				boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.04)",
				backdropFilter: "blur(4px)",
				WebkitBackdropFilter: "blur(4px)",
				margin: "10px 0",
				transition: "all 0.3s ease"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				width: "80px",
				height: "80px",
				background: adBlocked ? "rgba(239, 68, 68, 0.15)" : "rgba(79, 70, 229, 0.15)",
				borderRadius: "50%",
				filter: "blur(20px)",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				zIndex: 0
			} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					zIndex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: "0.8rem",
							fontWeight: 800,
							letterSpacing: "1.5px",
							color: adBlocked ? "var(--color-live)" : "rgba(79, 70, 229, 0.85)",
							textTransform: "uppercase",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							marginBottom: "4px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💰" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: adBlocked ? "Ad Blocker Active" : "AdSense Placeholder" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							fontSize: "0.75rem",
							color: "var(--text-secondary)",
							margin: "0 0 4px 0",
							maxWidth: "380px",
							lineHeight: "1.3"
						},
						children: adBlocked ? "We detected an ad blocker. Ads would appear here for your users in production." : "This slot is ready for Google AdSense! Set VITE_ADSENSE_PUB_ID in your env config to go live."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: "8px",
							fontSize: "0.65rem",
							color: "var(--text-muted)"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Client:" }),
								" ",
								publisherId || "ca-pub-XXXXXXXXXXXX"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Slot:" }),
								" ",
								slot
							] })
						]
					})
				]
			})]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `adsense-wrapper ${className}`,
			style: {
				margin: "15px 0",
				overflow: "hidden",
				textAlign: "center",
				minHeight: height
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ins", {
				className: "adsbygoogle",
				style,
				"data-ad-client": publisherId,
				"data-ad-slot": slot,
				"data-ad-format": format,
				"data-full-width-responsive": responsive
			})
		});
	}
	//#endregion
	//#region src/components/SportZWidget.jsx
	var renderLogo = (logo, fallback = "⚽", style = {}) => {
		if (!logo) return fallback;
		if (typeof logo === "string" && (logo.startsWith("http") || logo.startsWith("/") || logo.startsWith("."))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logo,
			alt: "logo",
			style: {
				width: "1.2em",
				height: "1.2em",
				objectFit: "contain",
				borderRadius: "4px",
				display: "inline-block",
				verticalAlign: "middle",
				...style
			},
			onError: (e) => {
				e.target.style.display = "none";
			}
		});
		return logo;
	};
	/**
	* Premium Self-Contained SportZ Widget Engine
	* 
	* Renders any of the 6 core tournament widgets:
	* 1. standings - Group stage standing tables
	* 2. topscorers - Golden Boot progress leaderboards
	* 3. livescores - Match listing grids
	* 4. fixtures - Calendar/round scheduled matches
	* 5. bracket - Interactive visual Knockout bracket tree
	* 6. matchcentre - Detailed single match console (Stats, Lineup, Events, Commentary)
	* 
	* Supports 4 themes:
	* - glass: Crystal Glassmorphism (Default)
	* - dark: Midnight Obsidian Dark Cyberpunk
	* - light: Pristine Snow Crisp Light
	* - gold: Championship Royal Gold Gradients
	*/
	function SportZWidget({ type = "standings", theme = "glass", accent = "#3b82f6", font = "Outfit", borders = "rounded", config = {}, selectedMatchIdProp = null, apiHost = "http://localhost:5000", licenseKey = null }) {
		const [standings, setStandings] = (0, react.useState)([]);
		const [topscorers, setTopscorers] = (0, react.useState)([]);
		const [matches, setMatches] = (0, react.useState)([]);
		const [activeMatchId, setActiveMatchId] = (0, react.useState)(selectedMatchIdProp);
		const [matchDetail, setMatchDetail] = (0, react.useState)(null);
		const [loading, setLoading] = (0, react.useState)(false);
		const [error, setError] = (0, react.useState)(null);
		const [detailSubTab, setDetailSubTab] = (0, react.useState)("timeline");
		const [scorerMetric, setScorerMetric] = (0, react.useState)(config.defaultMetric || "goals");
		const themeStyles = {
			glass: {
				background: "rgba(255, 255, 255, 0.45)",
				backdropFilter: "blur(14px) saturate(140%)",
				WebkitBackdropFilter: "blur(14px) saturate(140%)",
				border: borders === "sharp" ? "1.5px solid rgba(255,255,255,0.7)" : "1px solid rgba(255, 255, 255, 0.6)",
				borderRadius: borders === "sharp" ? "0px" : borders === "glass" ? "24px" : "16px",
				color: "#1e293b",
				textMuted: "#64748b",
				shadow: "0 8px 32px 0 rgba(31, 38, 135, 0.04)",
				tableRowHover: "rgba(255,255,255,0.25)",
				cardBg: "rgba(255,255,255,0.3)",
				inputBg: "rgba(255,255,255,0.4)",
				accentLight: "rgba(59, 130, 246, 0.12)"
			},
			dark: {
				background: "rgba(15, 23, 42, 0.9)",
				backdropFilter: "blur(16px) saturate(120%)",
				WebkitBackdropFilter: "blur(16px) saturate(120%)",
				border: borders === "sharp" ? "1.5px solid rgba(255,255,255,0.1)" : "1px solid rgba(255, 255, 255, 0.08)",
				borderRadius: borders === "sharp" ? "0px" : borders === "glass" ? "24px" : "16px",
				color: "#f8fafc",
				textMuted: "#94a3b8",
				shadow: "0 10px 40px 0 rgba(0, 0, 0, 0.4)",
				tableRowHover: "rgba(255,255,255,0.05)",
				cardBg: "rgba(30, 41, 59, 0.7)",
				inputBg: "rgba(30, 41, 59, 0.9)",
				accentLight: "rgba(59, 130, 246, 0.2)"
			},
			light: {
				background: "#ffffff",
				backdropFilter: "none",
				WebkitBackdropFilter: "none",
				border: borders === "sharp" ? "1.5px solid #cbd5e1" : "1px solid #e2e8f0",
				borderRadius: borders === "sharp" ? "0px" : borders === "glass" ? "24px" : "16px",
				color: "#0f172a",
				textMuted: "#64748b",
				shadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
				tableRowHover: "#f8fafc",
				cardBg: "#f1f5f9",
				inputBg: "#ffffff",
				accentLight: "rgba(59, 130, 246, 0.08)"
			},
			gold: {
				background: "linear-gradient(135deg, rgba(254, 253, 244, 0.95) 0%, rgba(254, 240, 138, 0.98) 100%)",
				backdropFilter: "blur(10px)",
				WebkitBackdropFilter: "blur(10px)",
				border: borders === "sharp" ? "2.5px solid #d97706" : "1.5px solid rgba(234, 179, 8, 0.5)",
				borderRadius: borders === "sharp" ? "0px" : borders === "glass" ? "28px" : "18px",
				color: "#451a03",
				textMuted: "#78350f",
				shadow: "0 8px 32px rgba(234, 179, 8, 0.15)",
				tableRowHover: "rgba(254, 249, 195, 0.6)",
				cardBg: "rgba(253, 224, 71, 0.2)",
				inputBg: "#ffffff",
				accentLight: "rgba(234, 179, 8, 0.15)"
			}
		};
		const style = themeStyles[theme] || themeStyles.glass;
		const wrapperStyle = {
			fontFamily: font === "Outfit" ? "'Outfit', sans-serif" : font === "Roboto" ? "'Roboto', sans-serif" : "'Inter', sans-serif",
			color: style.color,
			background: style.background,
			backdropFilter: style.backdropFilter,
			WebkitBackdropFilter: style.WebkitBackdropFilter,
			border: style.border,
			borderRadius: style.borderRadius,
			boxShadow: style.shadow,
			padding: "24px",
			width: "100%",
			transition: "all 0.3s ease",
			boxSizing: "border-box"
		};
		(0, react.useEffect)(() => {
			setLoading(true);
			setError(null);
			const loadData = async () => {
				try {
					if (type === "standings") {
						const res = await fetch(`${apiHost}/api/football/standings`);
						if (res.ok) setStandings(formatStandingsData(await res.json()));
						else setError("Failed to fetch live standings.");
					} else if (type === "topscorers") {
						const res = await fetch(`${apiHost}/api/football/topscorers`);
						if (res.ok) setTopscorers(formatTopscorersData(await res.json()));
						else setError("Failed to fetch topscorers.");
					} else if (type === "livescores" || type === "fixtures" || type === "matchcentre") {
						const res = await fetch(`${apiHost}/api/matches`);
						if (res.ok) {
							const data = await res.json();
							setMatches(data);
							const defaultId = selectedMatchIdProp || (data.length > 0 ? data[0].id : null);
							if (!activeMatchId && defaultId) setActiveMatchId(defaultId);
						} else setError("Failed to sync matches.");
					}
				} catch (err) {
					console.error("Widget API Error:", err);
					setError("Connection timeout. Offline cache loaded.");
					loadLocalFallbacks();
				} finally {
					setLoading(false);
				}
			};
			loadData();
		}, [type, apiHost]);
		(0, react.useEffect)(() => {
			if (type !== "matchcentre" || !activeMatchId) return;
			const loadMatchDetail = async () => {
				try {
					const res = await fetch(`${apiHost}/api/matches/${activeMatchId}`);
					if (res.ok) setMatchDetail(await res.json());
				} catch (err) {
					console.error("Failed to load match detail:", err);
				}
			};
			loadMatchDetail();
			const timer = setInterval(loadMatchDetail, 6e3);
			return () => clearInterval(timer);
		}, [
			activeMatchId,
			type,
			apiHost
		]);
		const loadLocalFallbacks = () => {
			if (type === "standings") setStandings(getMockStandings());
			else if (type === "topscorers") setTopscorers(getMockTopscorers());
		};
		const formatStandingsData = (data) => {
			if (data.length > 0 && data[0].group) return data;
			try {
				const groupsMap = {};
				data.forEach((item) => {
					const groupName = item.group?.name || "Group Stage";
					if (!groupsMap[groupName]) groupsMap[groupName] = [];
					groupsMap[groupName].push({
						rank: item.position,
						name: item.team?.name || "Team",
						logo: item.team?.image_path || "⚽",
						played: item.standing?.played || 0,
						won: item.standing?.won || 0,
						drawn: item.standing?.draw || 0,
						lost: item.standing?.lost || 0,
						gd: item.standing?.overall?.goal_difference || item.standing?.overall?.goals_scored - item.standing?.overall?.goals_against || 0,
						points: item.standing?.points || 0
					});
				});
				return Object.keys(groupsMap).map((group) => ({
					group,
					teams: groupsMap[group].sort((a, b) => a.rank - b.rank)
				}));
			} catch {
				return getMockStandings();
			}
		};
		const formatTopscorersData = (data) => {
			if (data.length > 0 && data[0].goals !== void 0) return data;
			try {
				return data.map((item, idx) => ({
					rank: idx + 1,
					name: item.player?.common_name || item.player?.display_name || "Player",
					logo: item.player?.image_path || "🏴",
					team: item.team?.name || "Country",
					goals: item.goals || 0,
					assists: item.assists || 0,
					played: item.appearances || 0
				})).sort((a, b) => b.goals - a.goals);
			} catch {
				return getMockTopscorers();
			}
		};
		const getMockStandings = () => [{
			group: "Group A",
			teams: [
				{
					rank: 1,
					name: "Czech Republic",
					logo: "🇨🇿",
					played: 3,
					won: 2,
					drawn: 1,
					lost: 0,
					gd: 4,
					points: 7
				},
				{
					rank: 2,
					name: "Mexico",
					logo: "🇲🇽",
					played: 3,
					won: 2,
					drawn: 0,
					lost: 1,
					gd: 2,
					points: 6
				},
				{
					rank: 3,
					name: "South Africa",
					logo: "🇿🇦",
					played: 3,
					won: 1,
					drawn: 1,
					lost: 1,
					gd: 0,
					points: 4
				},
				{
					rank: 4,
					name: "Korea Republic",
					logo: "🇰🇷",
					played: 3,
					won: 0,
					drawn: 0,
					lost: 3,
					gd: -6,
					points: 0
				}
			]
		}, {
			group: "Group B",
			teams: [
				{
					rank: 1,
					name: "Bosnia & Herz.",
					logo: "🇧🇦",
					played: 3,
					won: 3,
					drawn: 0,
					lost: 0,
					gd: 7,
					points: 9
				},
				{
					rank: 2,
					name: "Argentina",
					logo: "🇦🇷",
					played: 3,
					won: 2,
					drawn: 0,
					lost: 1,
					gd: 3,
					points: 6
				},
				{
					rank: 3,
					name: "Spain",
					logo: "🇪🇸",
					played: 3,
					won: 1,
					drawn: 0,
					lost: 2,
					gd: -1,
					points: 3
				},
				{
					rank: 4,
					name: "Canada",
					logo: "🇨🇦",
					played: 3,
					won: 0,
					drawn: 0,
					lost: 3,
					gd: -9,
					points: 0
				}
			]
		}];
		const getMockTopscorers = () => [
			{
				rank: 1,
				name: "Georges Mikautadze",
				logo: "🇬🇪",
				team: "Georgia",
				goals: 4,
				assists: 1,
				played: 4,
				yellowCards: 1,
				redCards: 0,
				minsPerGoal: 88,
				totalShots: 11,
				conversion: 36
			},
			{
				rank: 2,
				name: "Ivan Schranz",
				logo: "🇸🇰",
				team: "Slovakia",
				goals: 3,
				assists: 0,
				played: 4,
				yellowCards: 0,
				redCards: 0,
				minsPerGoal: 112,
				totalShots: 6,
				conversion: 50
			},
			{
				rank: 3,
				name: "Jamal Musiala",
				logo: "🇩🇪",
				team: "Germany",
				goals: 3,
				assists: 1,
				played: 5,
				yellowCards: 1,
				redCards: 0,
				minsPerGoal: 135,
				totalShots: 14,
				conversion: 21
			},
			{
				rank: 4,
				name: "Dani Olmo",
				logo: "🇪🇸",
				team: "Spain",
				goals: 3,
				assists: 2,
				played: 6,
				yellowCards: 0,
				redCards: 0,
				minsPerGoal: 144,
				totalShots: 18,
				conversion: 17
			},
			{
				rank: 5,
				name: "Cody Gakpo",
				logo: "🇳🇱",
				team: "Netherlands",
				goals: 3,
				assists: 1,
				played: 6,
				yellowCards: 2,
				redCards: 0,
				minsPerGoal: 175,
				totalShots: 13,
				conversion: 23
			}
		];
		const getBracketData = () => {
			return {
				r16Left: [
					{
						id: "L1",
						team1: {
							name: "Netherlands",
							logo: "🇳🇱",
							score: 3
						},
						team2: {
							name: "United States",
							logo: "🇺🇸",
							score: 1
						}
					},
					{
						id: "L2",
						team1: {
							name: "Argentina",
							logo: "🇦🇷",
							score: 2
						},
						team2: {
							name: "Australia",
							logo: "🇦🇺",
							score: 1
						}
					},
					{
						id: "L3",
						team1: {
							name: "Japan",
							logo: "🇯🇵",
							score: 1
						},
						team2: {
							name: "Croatia",
							logo: "🇭🇷",
							score: 1
						},
						detail: "Pen 1-3"
					},
					{
						id: "L4",
						team1: {
							name: "Brazil",
							logo: "🇧🇷",
							score: 4
						},
						team2: {
							name: "South Korea",
							logo: "🇰🇷",
							score: 1
						}
					}
				],
				qfLeft: [{
					id: "L5",
					team1: {
						name: "Netherlands",
						logo: "🇳🇱",
						score: 2
					},
					team2: {
						name: "Argentina",
						logo: "🇦🇷",
						score: 2
					},
					detail: "Pen 3-4"
				}, {
					id: "L6",
					team1: {
						name: "Croatia",
						logo: "🇭🇷",
						score: 1
					},
					team2: {
						name: "Brazil",
						logo: "🇧🇷",
						score: 1
					},
					detail: "Pen 4-2"
				}],
				sfLeft: [{
					id: "L7",
					team1: {
						name: "Argentina",
						logo: "🇦🇷",
						score: 3
					},
					team2: {
						name: "Croatia",
						logo: "🇭🇷",
						score: 0
					}
				}],
				final: {
					id: "F1",
					team1: {
						name: "Argentina",
						logo: "🇦🇷",
						score: 3
					},
					team2: {
						name: "France",
						logo: "🇫🇷",
						score: 3
					},
					detail: "Pen 4-2 (Champion: ARG!)"
				},
				sfRight: [{
					id: "R7",
					team1: {
						name: "France",
						logo: "🇫🇷",
						score: 2
					},
					team2: {
						name: "Morocco",
						logo: "🇲🇦",
						score: 0
					}
				}],
				qfRight: [{
					id: "R5",
					team1: {
						name: "England",
						logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
						score: 1
					},
					team2: {
						name: "France",
						logo: "🇫🇷",
						score: 2
					}
				}, {
					id: "R6",
					team1: {
						name: "Morocco",
						logo: "🇲🇦",
						score: 1
					},
					team2: {
						name: "Portugal",
						logo: "🇵🇹",
						score: 0
					}
				}],
				r16Right: [
					{
						id: "R1",
						team1: {
							name: "England",
							logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
							score: 3
						},
						team2: {
							name: "Senegal",
							logo: "🇸🇳",
							score: 0
						}
					},
					{
						id: "R2",
						team1: {
							name: "France",
							logo: "🇫🇷",
							score: 3
						},
						team2: {
							name: "Poland",
							logo: "🇵🇱",
							score: 1
						}
					},
					{
						id: "R3",
						team1: {
							name: "Morocco",
							logo: "🇲🇦",
							score: 0
						},
						team2: {
							name: "Spain",
							logo: "🇪🇸",
							score: 0
						},
						detail: "Pen 3-0"
					},
					{
						id: "R4",
						team1: {
							name: "Portugal",
							logo: "🇵🇹",
							score: 6
						},
						team2: {
							name: "Switzerland",
							logo: "🇨🇭",
							score: 1
						}
					}
				]
			};
		};
		if (loading && standings.length === 0 && topscorers.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				...wrapperStyle,
				padding: "50px 20px",
				textAlign: "center"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					width: "32px",
					height: "32px",
					border: `3px solid ${accent}`,
					borderTopColor: "transparent",
					borderRadius: "50%",
					animation: "spin 1s linear infinite",
					margin: "0 auto 12px auto"
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						fontSize: "0.85rem",
						fontWeight: 600,
						color: style.textMuted
					},
					children: "Syncing live widget data..."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` })
			]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sportz-widget-root",
			style: wrapperStyle,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						borderBottom: `1.5px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
						paddingBottom: "14px",
						marginBottom: "18px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "10px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: "1.25rem",
								padding: "6px",
								background: style.cardBg,
								borderRadius: "8px"
							},
							children: type === "standings" ? "📊" : type === "topscorers" ? "👟" : type === "livescores" ? "⚽" : type === "fixtures" ? "📅" : type === "bracket" ? "🌳" : "🏟️"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: "1rem",
								fontWeight: 800,
								margin: 0,
								textTransform: "uppercase",
								letterSpacing: "0.5px"
							},
							children: type === "standings" ? "World Cup Standings" : type === "topscorers" ? "Golden Boot Race" : type === "livescores" ? "Live Matches" : type === "fixtures" ? "Schedules" : type === "bracket" ? "Knockout Bracket" : "Live Match Centre"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: "0.65rem",
								fontWeight: 700,
								color: style.textMuted,
								textTransform: "uppercase"
							},
							children: "SportZ Live Engine"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "6px",
							fontSize: "0.75rem",
							fontWeight: 700
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
							width: "6px",
							height: "6px",
							borderRadius: "50%",
							backgroundColor: "#ef4444",
							display: "inline-block",
							boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.2)"
						} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: { color: style.textMuted },
							children: "LIVE UPDATES"
						})]
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						padding: "8px 12px",
						background: "rgba(239, 68, 68, 0.08)",
						border: "1px solid rgba(239, 68, 68, 0.15)",
						borderRadius: "8px",
						fontSize: "0.75rem",
						color: "#ef4444",
						marginBottom: "14px",
						fontWeight: 500
					},
					children: ["⚠️ ", error]
				}),
				type === "standings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
						gap: "16px"
					},
					children: standings.map((gp, gIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: style.cardBg,
							borderRadius: "12px",
							padding: "14px",
							border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}`
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							style: {
								fontSize: "0.85rem",
								fontWeight: 800,
								borderBottom: "1px solid rgba(0,0,0,0.04)",
								paddingBottom: "6px",
								marginBottom: "8px",
								display: "flex",
								alignItems: "center",
								gap: "6px"
							},
							children: ["⚽ ", gp.group]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							style: {
								width: "100%",
								borderCollapse: "collapse",
								fontSize: "0.75rem",
								textAlign: "left"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								style: {
									color: style.textMuted,
									fontWeight: 700,
									borderBottom: "1px solid rgba(0,0,0,0.03)"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										style: {
											padding: "6px 4px",
											width: "20px"
										},
										children: "#"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										style: { padding: "6px 4px" },
										children: "Team"
									}),
									!config.hidePlayed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										style: {
											padding: "6px 4px",
											textAlign: "center",
											width: "25px"
										},
										children: "P"
									}),
									!config.hideGD && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										style: {
											padding: "6px 4px",
											textAlign: "center",
											width: "25px"
										},
										children: "GD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										style: {
											padding: "6px 4px",
											textAlign: "right",
											width: "25px",
											fontWeight: 800
										},
										children: "PTS"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: gp.teams.map((t, tIdx) => {
								const isQualifying = t.rank <= (config.qualifyingCount || 2);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									style: {
										backgroundColor: isQualifying ? "rgba(16, 185, 129, 0.05)" : "transparent",
										borderBottom: "1px solid rgba(0,0,0,0.02)"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												padding: "8px 4px",
												fontWeight: 800,
												color: isQualifying ? "#10b981" : style.textMuted
											},
											children: t.rank
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												padding: "8px 4px",
												fontWeight: 600
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "6px"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: "1rem",
														lineHeight: "1",
														display: "inline-flex",
														alignItems: "center"
													},
													children: renderLogo(t.logo, "⚽")
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name })]
											})
										}),
										!config.hidePlayed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												padding: "8px 4px",
												textAlign: "center",
												color: style.textMuted
											},
											children: t.played
										}),
										!config.hideGD && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												padding: "8px 4px",
												textAlign: "center",
												fontWeight: 700,
												color: t.gd > 0 ? "#10b981" : t.gd < 0 ? "#ef4444" : style.textMuted
											},
											children: t.gd > 0 ? `+${t.gd}` : t.gd
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												padding: "8px 4px",
												textAlign: "right",
												fontWeight: 800
											},
											children: t.points
										})
									]
								}, tIdx);
							}) })]
						})]
					}, gIdx))
				}),
				type === "topscorers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "10px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: "6px",
							background: "rgba(0,0,0,0.04)",
							padding: "4px",
							borderRadius: "8px",
							marginBottom: "8px",
							maxWidth: "300px"
						},
						children: [
							"goals",
							"assists",
							"yellowCards",
							"redCards"
						].map((metric) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setScorerMetric(metric),
							style: {
								flex: 1,
								padding: "4px 8px",
								fontSize: "0.65rem",
								fontWeight: 700,
								border: "none",
								borderRadius: "6px",
								cursor: "pointer",
								backgroundColor: scorerMetric === metric ? "#ffffff" : "transparent",
								color: scorerMetric === metric ? accent : style.textMuted,
								boxShadow: scorerMetric === metric ? "0 1px 4px rgba(0,0,0,0.05)" : "none",
								textTransform: "capitalize"
							},
							children: metric === "yellowCards" ? "Yellows" : metric === "redCards" ? "Reds" : metric
						}, metric))
					}), topscorers.slice(0, config.limit || 5).map((p, idx) => {
						const val = p[scorerMetric] !== void 0 ? p[scorerMetric] : scorerMetric === "goals" ? p.goals : p.assists;
						const pct = Math.min(val / ((scorerMetric === "goals" ? 4 : scorerMetric === "assists" ? 2 : 2) || 1) * 100, 100);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: style.cardBg,
								border: `1px solid ${idx === 0 ? "rgba(59, 130, 246, 0.15)" : "rgba(0,0,0,0.02)"}`,
								padding: "10px 14px",
								borderRadius: "10px",
								display: "flex",
								flexDirection: "column",
								gap: "6px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "10px"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontWeight: 800,
												fontSize: "0.8rem",
												color: idx === 0 ? "#f59e0b" : style.textMuted,
												width: "20px"
											},
											children: idx + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontSize: "1.2rem",
												display: "inline-flex",
												alignItems: "center"
											},
											children: renderLogo(p.logo, "🏴")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontWeight: 800,
												fontSize: "0.8rem"
											},
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												display: "block",
												fontSize: "0.6rem",
												color: style.textMuted,
												fontWeight: 500
											},
											children: p.team
										})] })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										display: "flex",
										gap: "12px",
										fontSize: "0.75rem",
										fontWeight: 800
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { textAlign: "right" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: accent,
												fontSize: "0.9rem",
												fontWeight: 900
											},
											children: val
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												display: "block",
												fontSize: "0.55rem",
												color: style.textMuted
											},
											children: scorerMetric.toUpperCase()
										})]
									})
								})]
							}), !config.hideProgressBar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: "100%",
									height: "3.5px",
									background: "rgba(0,0,0,0.03)",
									borderRadius: "2px",
									overflow: "hidden"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									width: `${pct}%`,
									height: "100%",
									background: `linear-gradient(90deg, ${accent} 0%, #a78bfa 100%)`,
									borderRadius: "2px",
									transition: "width 0.8s ease"
								} })
							})]
						}, idx);
					})]
				}),
				type === "livescores" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "10px"
					},
					children: matches.filter((m) => !config.sportFilter || m.sport === config.sportFilter).slice(0, config.limit || 5).map((m, idx) => {
						const isLive = m.status === "live";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: style.cardBg,
								borderRadius: "12px",
								padding: "12px 16px",
								border: isLive ? `1.5px solid ${accent}` : "1px solid rgba(0,0,0,0.03)",
								cursor: "pointer",
								display: "flex",
								flexDirection: "column",
								gap: "8px"
							},
							onClick: () => {
								if (config.onMatchSelect) config.onMatchSelect(m.id);
								setActiveMatchId(m.id);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									fontSize: "0.65rem",
									fontWeight: 700,
									color: style.textMuted
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.league }), isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: {
										color: "#ef4444",
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
											width: "6px",
											height: "6px",
											backgroundColor: "#ef4444",
											borderRadius: "50%"
										} }),
										"LIVE (",
										m.time,
										")"
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { textTransform: "capitalize" },
									children: m.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "1fr auto 1fr",
									alignItems: "center",
									gap: "10px"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px",
											fontWeight: 700,
											fontSize: "0.8rem"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontSize: "1.1rem",
												display: "inline-flex",
												alignItems: "center"
											},
											children: renderLogo(m.homeTeam.logo, "⚽")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis"
											},
											children: m.homeTeam.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											padding: "4px 10px",
											background: "rgba(0,0,0,0.04)",
											borderRadius: "6px",
											fontWeight: 900,
											fontSize: "0.85rem",
											textAlign: "center"
										},
										children: m.status === "upcoming" ? m.time : `${m.score.home} - ${m.score.away}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px",
											fontWeight: 700,
											fontSize: "0.8rem",
											justifyContent: "flex-end"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis"
											},
											children: m.awayTeam.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontSize: "1.1rem",
												display: "inline-flex",
												alignItems: "center"
											},
											children: renderLogo(m.awayTeam.logo, "⚽")
										})]
									})
								]
							})]
						}, idx);
					})
				}),
				type === "fixtures" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "8px"
					},
					children: matches.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: style.cardBg,
							border: "1px solid rgba(0,0,0,0.02)",
							borderRadius: "10px",
							padding: "10px 14px",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: {
								fontSize: "0.6rem",
								color: style.textMuted,
								fontWeight: 700,
								display: "block",
								textTransform: "uppercase"
							},
							children: [
								m.league,
								" • ",
								m.date
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "6px",
								marginTop: "3px"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: {
										fontWeight: 700,
										fontSize: "0.75rem",
										display: "inline-flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [
										renderLogo(m.homeTeam.logo, "⚽"),
										" ",
										m.homeTeam.name
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: "0.65rem",
										color: style.textMuted
									},
									children: "vs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: {
										fontWeight: 700,
										fontSize: "0.75rem",
										display: "inline-flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [
										renderLogo(m.awayTeam.logo, "⚽"),
										" ",
										m.awayTeam.name
									]
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { textAlign: "right" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									padding: "4px 8px",
									background: "rgba(0,0,0,0.04)",
									borderRadius: "6px",
									fontSize: "0.65rem",
									fontWeight: 800,
									color: m.status === "live" ? "#ef4444" : style.color
								},
								children: m.status === "live" ? "🔴 LIVE" : m.status === "recent" || m.status === "historical" ? "FT" : m.time
							}), config.showVenue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									display: "block",
									fontSize: "0.55rem",
									color: style.textMuted,
									marginTop: "4px"
								},
								children: m.venue
							})]
						})]
					}, idx))
				}),
				type === "bracket" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						overflowX: "auto",
						paddingBottom: "10px",
						width: "100%",
						display: "block"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							gap: "15px",
							minWidth: "850px",
							padding: "10px"
						},
						children: (() => {
							const b = getBracketData();
							const nodeStyle = (match, isLeft) => ({
								background: style.cardBg,
								border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}`,
								borderRadius: "8px",
								padding: "6px 10px",
								width: "140px",
								fontSize: "0.7rem",
								display: "flex",
								flexDirection: "column",
								gap: "4px",
								boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
								position: "relative"
							});
							const renderTeamRow = (team, oppositeTeam) => {
								const isWinner = team.score !== null && oppositeTeam.score !== null && team.score > oppositeTeam.score;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										fontWeight: isWinner ? 800 : 500,
										opacity: isWinner ? 1 : .75
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "4px"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontSize: "0.9rem",
												display: "inline-flex",
												alignItems: "center"
											},
											children: renderLogo(team.logo, "⚽")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												textOverflow: "ellipsis",
												overflow: "hidden",
												whiteSpace: "nowrap",
												maxWidth: "85px"
											},
											children: team.name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontWeight: 800,
											color: isWinner ? accent : style.color
										},
										children: team.score
									})]
								});
							};
							const renderMatchBox = (m, isLeft) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: nodeStyle(m, isLeft),
								children: [
									renderTeamRow(m.team1, m.team2),
									renderTeamRow(m.team2, m.team1),
									m.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: "0.55rem",
											color: style.textMuted,
											textAlign: "center",
											borderTop: "0.5px solid rgba(0,0,0,0.04)",
											paddingTop: "2px",
											marginTop: "2px",
											fontWeight: 600
										},
										children: m.detail
									})
								]
							}, m.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "20px",
										justifyContent: "space-around"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: "0.6rem",
											fontWeight: 800,
											color: style.textMuted,
											textAlign: "center",
											textTransform: "uppercase"
										},
										children: "Round of 16"
									}), b.r16Left.map((m) => renderMatchBox(m, true))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "60px",
										justifyContent: "center"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: "0.6rem",
											fontWeight: 800,
											color: style.textMuted,
											textAlign: "center",
											textTransform: "uppercase"
										},
										children: "Quarter-Finals"
									}), b.qfLeft.map((m) => renderMatchBox(m, true))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										justifyContent: "center"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: "0.6rem",
											fontWeight: 800,
											color: style.textMuted,
											textAlign: "center",
											textTransform: "uppercase",
											marginBottom: "40px"
										},
										children: "Semi-Finals"
									}), b.sfLeft.map((m) => renderMatchBox(m, true))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										gap: "12px"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontSize: "2rem",
												animation: "bounce 2s infinite"
											},
											children: "🏆"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												fontSize: "0.65rem",
												fontWeight: 900,
												color: "#f59e0b",
												textTransform: "uppercase",
												letterSpacing: "0.5px"
											},
											children: "GRAND FINAL"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												...nodeStyle(b.final, false),
												width: "160px",
												border: "2px solid rgba(245, 158, 11, 0.45)",
												background: "linear-gradient(135deg, rgba(254, 253, 244, 0.5), rgba(254, 240, 138, 0.35))"
											},
											children: [
												renderTeamRow(b.final.team1, b.final.team2),
												renderTeamRow(b.final.team2, b.final.team1),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													style: {
														fontSize: "0.55rem",
														color: "#b45309",
														textAlign: "center",
														borderTop: "0.5px solid rgba(245, 158, 11, 0.3)",
														paddingTop: "3px",
														marginTop: "3px",
														fontWeight: 800
													},
													children: [
														"⭐ ",
														b.final.detail,
														" ⭐"
													]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										justifyContent: "center"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: "0.6rem",
											fontWeight: 800,
											color: style.textMuted,
											textAlign: "center",
											textTransform: "uppercase",
											marginBottom: "40px"
										},
										children: "Semi-Finals"
									}), b.sfRight.map((m) => renderMatchBox(m, false))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "60px",
										justifyContent: "center"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: "0.6rem",
											fontWeight: 800,
											color: style.textMuted,
											textAlign: "center",
											textTransform: "uppercase"
										},
										children: "Quarter-Finals"
									}), b.qfRight.map((m) => renderMatchBox(m, false))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "20px",
										justifyContent: "space-around"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: "0.6rem",
											fontWeight: 800,
											color: style.textMuted,
											textAlign: "center",
											textTransform: "uppercase"
										},
										children: "Round of 16"
									}), b.r16Right.map((m) => renderMatchBox(m, false))]
								})
							] });
						})()
					})
				}),
				type === "matchcentre" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "16px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: "8px",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							style: {
								fontSize: "0.7rem",
								fontWeight: 700,
								color: style.textMuted
							},
							children: "SELECT MATCH:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: activeMatchId || "",
							onChange: (e) => setActiveMatchId(e.target.value),
							style: {
								background: style.inputBg,
								color: style.color,
								border: `1px solid ${style.textMuted}40`,
								borderRadius: "6px",
								padding: "4px 8px",
								fontSize: "0.7rem",
								fontWeight: 600,
								outline: "none"
							},
							children: matches.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: m.id,
								children: [
									m.homeTeam.name,
									" vs ",
									m.awayTeam.name,
									" (",
									m.sport === "cricket" ? "Cricket" : "Football",
									")"
								]
							}, m.id))
						})]
					}), matchDetail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: style.cardBg,
							borderRadius: "12px",
							padding: "16px",
							border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}`,
							display: "flex",
							flexDirection: "column",
							gap: "14px"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { textAlign: "center" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: {
										fontSize: "0.6rem",
										fontWeight: 700,
										color: style.textMuted,
										textTransform: "uppercase"
									},
									children: [
										matchDetail.league,
										" • ",
										matchDetail.venue
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										justifyContent: "space-around",
										alignItems: "center",
										marginTop: "10px"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												gap: "6px",
												flex: 1
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: "2rem",
													display: "inline-flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: renderLogo(matchDetail.homeTeam.logo, "⚽")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: "0.85rem",
													fontWeight: 800
												},
												children: matchDetail.homeTeam.name
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												gap: "4px",
												padding: "0 10px"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													fontSize: "1.8rem",
													fontWeight: 900,
													background: "rgba(0,0,0,0.04)",
													padding: "4px 14px",
													borderRadius: "8px",
													color: matchDetail.status === "live" ? "#ef4444" : style.color
												},
												children: matchDetail.status === "upcoming" ? "VS" : matchDetail.score.home + " - " + matchDetail.score.away
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: "0.65rem",
													fontWeight: 800,
													color: matchDetail.status === "live" ? "#ef4444" : style.textMuted,
													background: matchDetail.status === "live" ? "rgba(239, 68, 68, 0.08)" : "transparent",
													padding: "2px 6px",
													borderRadius: "4px"
												},
												children: matchDetail.status === "live" ? `🔴 LIVE (${matchDetail.time})` : matchDetail.status.toUpperCase()
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												gap: "6px",
												flex: 1
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: "2rem",
													display: "inline-flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: renderLogo(matchDetail.awayTeam.logo, "⚽")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: "0.85rem",
													fontWeight: 800
												},
												children: matchDetail.awayTeam.name
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									gap: "4px",
									background: "rgba(0,0,0,0.04)",
									padding: "3px",
									borderRadius: "8px"
								},
								children: [
									{
										id: "timeline",
										label: "Timeline"
									},
									{
										id: "stats",
										label: "Stats"
									},
									{
										id: "lineups",
										label: "Lineups"
									},
									{
										id: "commentary",
										label: "Commentary"
									}
								].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDetailSubTab(tab.id),
									style: {
										flex: 1,
										padding: "6px 4px",
										fontSize: "0.65rem",
										fontWeight: 700,
										border: "none",
										borderRadius: "6px",
										cursor: "pointer",
										backgroundColor: detailSubTab === tab.id ? "#ffffff" : "transparent",
										color: detailSubTab === tab.id ? accent : style.textMuted,
										boxShadow: detailSubTab === tab.id ? "0 1px 4px rgba(0,0,0,0.05)" : "none"
									},
									children: tab.label
								}, tab.id))
							}),
							detailSubTab === "timeline" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "8px",
									maxHeight: "180px",
									overflowY: "auto"
								},
								children: matchDetail.timeline && matchDetail.timeline.length > 0 ? matchDetail.timeline.map((event, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px",
										fontSize: "0.7rem",
										padding: "6px 8px",
										borderRadius: "6px",
										backgroundColor: "rgba(255,255,255,0.05)"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											style: {
												fontWeight: 800,
												color: accent,
												width: "25px"
											},
											children: [event.minute, "'"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { fontSize: "0.9rem" },
											children: event.type === "goal" ? "⚽" : event.type === "yellow" ? "🟨" : event.type === "red" ? "🟥" : "🔔"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: { flex: 1 },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { fontWeight: 800 },
												children: event.player
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												style: {
													fontSize: "0.6rem",
													color: style.textMuted,
													marginLeft: "6px"
												},
												children: [
													"(",
													event.detail,
													")"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontSize: "0.55rem",
												fontWeight: 700,
												textTransform: "uppercase",
												color: style.textMuted
											},
											children: event.team
										})
									]
								}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										padding: "20px",
										textAlign: "center",
										fontSize: "0.7rem",
										color: style.textMuted
									},
									children: "No events reported yet."
								})
							}),
							detailSubTab === "stats" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "10px"
								},
								children: matchDetail.stats ? Object.keys(matchDetail.stats).map((key, idx) => {
									const stat = matchDetail.stats[key];
									const total = stat.home + stat.away || 1;
									const homePct = stat.home / total * 100;
									const label = key.replace(/([A-Z])/g, " $1").toUpperCase();
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "4px",
											fontSize: "0.65rem"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												fontWeight: 700
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stat.home }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														color: style.textMuted,
														fontSize: "0.55rem"
													},
													children: label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stat.away })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												width: "100%",
												height: "4px",
												background: "rgba(0,0,0,0.03)",
												borderRadius: "2px",
												display: "flex",
												overflow: "hidden"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
												width: `${homePct}%`,
												height: "100%",
												backgroundColor: accent
											} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
												flex: 1,
												height: "100%",
												backgroundColor: "#a78bfa"
											} })]
										})]
									}, idx);
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										padding: "20px",
										textAlign: "center",
										fontSize: "0.7rem",
										color: style.textMuted
									},
									children: "Stats unavailable for upcoming fixtures."
								})
							}),
							detailSubTab === "lineups" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "10px",
									fontSize: "0.7rem"
								},
								children: matchDetail.lineups ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "12px"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										style: {
											fontWeight: 800,
											fontSize: "0.75rem",
											marginBottom: "6px",
											color: accent
										},
										children: [
											matchDetail.homeTeam.name,
											" (",
											matchDetail.lineups.home.formation,
											")"
										]
									}), matchDetail.lineups.home.startingXI.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											padding: "3px 0",
											borderBottom: "0.5px solid rgba(0,0,0,0.02)"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													color: style.textMuted,
													width: "16px",
													display: "inline-block"
												},
												children: p.number
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { fontWeight: 600 },
												children: p.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												style: {
													fontSize: "0.55rem",
													color: style.textMuted,
													marginLeft: "4px"
												},
												children: [
													"[",
													p.position,
													"]"
												]
											})
										]
									}, idx))] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										style: {
											fontWeight: 800,
											fontSize: "0.75rem",
											marginBottom: "6px",
											color: "#a78bfa"
										},
										children: [
											matchDetail.awayTeam.name,
											" (",
											matchDetail.lineups.away.formation,
											")"
										]
									}), matchDetail.lineups.away.startingXI.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											padding: "3px 0",
											borderBottom: "0.5px solid rgba(0,0,0,0.02)",
											textAlign: "right"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												style: {
													fontSize: "0.55rem",
													color: style.textMuted,
													marginRight: "4px"
												},
												children: [
													"[",
													p.position,
													"]"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { fontWeight: 600 },
												children: p.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													color: style.textMuted,
													width: "16px",
													display: "inline-block",
													textAlign: "right",
													marginLeft: "6px"
												},
												children: p.number
											})
										]
									}, idx))] })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										padding: "20px",
										textAlign: "center",
										color: style.textMuted
									},
									children: "Lineup lists will appear close to match-off time."
								})
							}),
							detailSubTab === "commentary" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "8px",
									maxHeight: "180px",
									overflowY: "auto"
								},
								children: matchDetail.commentary && matchDetail.commentary.length > 0 ? matchDetail.commentary.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										fontSize: "0.7rem",
										padding: "6px 10px",
										borderRadius: "6px",
										backgroundColor: "rgba(255,255,255,0.03)",
										lineHeight: "1.4"
									},
									children: [
										c.minute && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											style: {
												fontWeight: 800,
												color: accent,
												marginRight: "6px"
											},
											children: [
												"[",
												c.minute,
												"]"
											]
										}),
										c.over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											style: {
												fontWeight: 800,
												color: accent,
												marginRight: "6px"
											},
											children: [
												"[Ov ",
												c.over,
												"]"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.text })
									]
								}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										padding: "20px",
										textAlign: "center",
										color: style.textMuted
									},
									children: "Live commentaries will start at kick-off."
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							padding: "20px",
							textAlign: "center",
							fontSize: "0.75rem",
							color: style.textMuted
						},
						children: "Please select a valid match center fixture."
					})]
				}),
				window.location.search.includes("embed=true") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSenseAd, {
					slot: "8837482910",
					height: "90px",
					licenseKey
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginTop: "16px",
						paddingTop: "10px",
						borderTop: `1.5px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
						fontSize: "0.65rem",
						fontWeight: 700,
						color: style.textMuted
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: window.location.origin,
						target: "_blank",
						rel: "noopener noreferrer",
						style: {
							color: accent,
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
							gap: "4px",
							transition: "opacity 0.2s"
						},
						onMouseEnter: (e) => e.target.style.opacity = "0.8",
						onMouseLeave: (e) => e.target.style.opacity = "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚡ Widget by" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontWeight: 900,
								textTransform: "uppercase",
								letterSpacing: "0.2px"
							},
							children: "SportZ Live Center"
						})]
					})
				})] })
			]
		});
	}
	//#endregion
	exports.SportZWidget = SportZWidget;
});

//# sourceMappingURL=sportz-widget.umd.js.map