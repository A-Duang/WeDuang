---
tags: [Python, 八股文, 测开面试, 编程语言]
source: "测开知识库"
created: 2026-06-26
related:
  - "[[测开指导/测开指导-md/基础知识/01-计算机基础]]"
  - "[[测开指导/测开指导-md/基础知识/02-Java核心技术]]"
  - "[[测开指导/测开指导-md/基础知识/03-测试理论与策略]]"
  - "[[测开指导/测开指导-md/基础知识/05-手撕代码高频题]]"
  - "[[测开指导/测开指导-md/业务面试题/Python自动化测试]]"
  - "[[测开指导/概念/自动化测试]]"
---

# Python 核心技术面试题

> 测试开发工程师 Python 核心考察范围 | 基础 + 进阶 + 并发 + 测试相关
>
> Python 是测开岗位最常用的语言之一，面试中出现频率极高。本文覆盖基础语法、数据结构、函数进阶、面向对象、并发编程、内存管理、测试框架等高频考点。

---

## 一、Python 基础

### 1. Python 的特点是什么？和 Java 的区别？

Python 是解释型、动态类型、强类型语言，语法简洁，开发效率高。特点：自动内存管理（GC）、鸭子类型、函数式编程支持、丰富的第三方库。

和 Java 的区别：
- Python 解释执行，Java 编译为字节码再由 JVM 执行
- Python 动态类型（变量不需要声明类型），Java 静态类型
- Python 用缩进表示代码块，Java 用花括号
- Python 多继承，Java 单继承（接口多实现）
- Python 运行速度较慢，Java 较快
- Python 在 AI/数据/脚本领域强势，Java 在企业级应用/大数据领域强势

---

### 2. Python 的六大标准数据类型？可变和不可变的区别？

不可变数据：Number（int/float/bool/complex）、String、Tuple、FrozenSet
可变数据：List、Dictionary、Set

可变 vs 不可变：
- 不可变：对象创建后值不能修改，修改会创建新对象（内存地址改变）。通过 `id()` 可以验证。
- 可变：对象创建后值可以修改，内存地址不变。

```python
a = "hello"
print(id(a))  # 140234567890
a = a + " world"
print(id(a))  # 140234567999  # 地址变了，说明是新对象

b = [1, 2, 3]
print(id(b))  # 140234568000
b.append(4)
print(id(b))  # 140234568000  # 地址没变，说明是原地修改
```

面试加分：不可变对象是 hashable 的，可以作为 dict 的 key 和 set 的元素；可变对象不行。

---

### 3. == 和 is 的区别？

- `==` 比较的是值是否相等（调用 `__eq__` 方法）
- `is` 比较的是内存地址是否相同（是否是同一个对象）

```python
a = [1, 2, 3]
b = [1, 2, 3]
a == b  # True（值相同）
a is b  # False（不是同一个对象）

c = a
a is c  # True（指向同一个对象）
```

面试追问：小整数池（-5 ~ 256）和字符串驻留机制。Python 会缓存小整数和短字符串，所以 `a = 256; b = 256; a is b` 为 True，但 `a = 257; b = 257; a is b` 可能为 False（取决于实现）。不要用 `is` 比较值，只用它判断是否是同一对象。

---

### 4. 深拷贝和浅拷贝的区别？

- 浅拷贝（shallow copy）：创建新对象，但内部元素是原对象的引用。修改嵌套对象会影响原对象。
- 深拷贝（deep copy）：创建新对象，递归复制所有嵌套对象。完全独立，互不影响。

```python
import copy

a = [[1, 2], [3, 4]]
b = copy.copy(a)        # 浅拷贝
c = copy.deepcopy(a)    # 深拷贝

a[0].append(99)
print(b)  # [[1, 2, 99], [3, 4]]  # 浅拷贝受影响
print(c)  # [[1, 2], [3, 4]]       # 深拷贝不受影响
```

常见浅拷贝方式：`list()`、`[:]`、`copy.copy()`、`dict()`、`set()`。
面试重点：函数传参时传的是引用的副本（类似 Java 的值传递），对可变对象的修改会影响外部，但重新赋值不影响外部。

---

### 5. 列表（List）和元组（Tuple）的区别？

| 特性 | List | Tuple |
|------|------|-------|
| 可变性 | 可变 | 不可变 |
| 语法 | `[1, 2, 3]` | `(1, 2, 3)` |
| 性能 | 稍慢（需额外内存管理） | 更快（固定大小） |
| 可哈希 | 不可以 | 可以（当元素都是不可变时） |
| 使用场景 | 需要频繁增删改 | 数据不应被修改、作为 dict key |

面试追问：元组的不可变是指引用不可变，如果元组里有列表，列表的内容是可以改的：
```python
t = (1, [2, 3])
t[1].append(4)  # 可以！t 变成 (1, [2, 3, 4])
t[1] = [5, 6]   # 报错！不能改变引用
```

---

### 6. 字典（Dict）的底层实现？Python 3.7+ 有什么变化？

Python 字典底层是哈希表（hash table），通过哈希函数将 key 映射到数组下标，冲突时用开放寻址法解决。

Python 3.7+ 的变化：字典保持插入顺序（3.6 是 CPython 实现细节，3.7 成为语言规范）。底层改用两个数组：一个存紧凑的键值对（按插入顺序），一个存稀疏的哈希索引表。好处是内存更紧凑、遍历更快。

字典查找时间复杂度：平均 O(1)，最坏 O(n)（所有 key 哈希冲突时）。

---

### 7. 列表推导式和生成器表达式的区别？

```python
# 列表推导式：一次性生成所有元素，存入内存
squares = [x**2 for x in range(10)]  # 返回 list

# 生成器表达式：惰性求值，逐个生成，节省内存
squares_gen = (x**2 for x in range(10))  # 返回 generator
```

- 列表推导式：一次性加载到内存，适合数据量小的场景
- 生成器表达式：惰性求值，每次 `next()` 生成一个值，适合大数据量/流式处理
- 生成器只能遍历一次，列表可以多次遍历

---

### 8. 迭代器和生成器的区别？

迭代器（Iterator）：实现了 `__iter__()` 和 `__next__()` 方法的对象。`__next__()` 返回下一个元素，没有元素时抛出 `StopIteration`。可以用 `iter()` 将可迭代对象转为迭代器。

生成器（Generator）：用 `yield` 关键字的函数，是一种特殊的迭代器。每次调用 `next()` 执行到 `yield` 暂停，下次从暂停处继续。

```python
def my_gen():
    yield 1
    yield 2
    yield 3

g = my_gen()
next(g)  # 1
next(g)  # 2
next(g)  # 3
```

生成器的优势：代码更简洁、内存更省（不需要一次性存所有值）。典型应用：读取大文件、斐波那契数列。

---

## 二、函数进阶

### 9. *args 和 **kwargs 是什么？

- `*args`：接收任意数量的位置参数，打包成元组
- `**kwargs`：接收任意数量的关键字参数，打包成字典

```python
def func(a, *args, **kwargs):
    print(a)        # 1
    print(args)     # (2, 3)
    print(kwargs)   # {'x': 4, 'y': 5}

func(1, 2, 3, x=4, y=5)
```

注意顺序：普通参数 → `*args` → 关键字参数 → `**kwargs`。
解包：`*list` 解包列表，`**dict` 解包字典。

---

### 10. 什么是闭包（Closure）？

闭包：内部函数引用了外部函数的变量，且外部函数返回内部函数。即使外部函数执行完毕，内部函数仍然能访问外部变量。

```python
def outer(x):
    def inner(y):
        return x + y  # 引用了外部变量 x
    return inner

f = outer(10)
f(5)  # 15（outer 已执行完毕，但 x=10 被闭包保留）
```

应用：装饰器、回调函数、工厂函数。面试追问：闭包中的变量是只读的吗？Python 3 中如果要修改外部变量，需要用 `nonlocal` 声明。

---

### 11. 什么是装饰器（Decorator）？举例说明？

装饰器本质是一个高阶函数，接收函数作为参数，返回一个新函数。用于在不修改原函数代码的情况下增加功能。

```python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} 耗时: {time.time() - start:.2f}s")
        return result
    return wrapper

@timer
def slow_func():
    time.sleep(1)

slow_func()  # 输出: slow_func 耗时: 1.00s
```

面试重点：手写一个装饰器、带参数的装饰器、`functools.wraps` 保留原函数元信息。实际应用：日志记录、权限校验、性能统计、缓存（`@lru_cache`）。

---

### 12. lambda 函数是什么？使用场景？

lambda 是匿名函数，只能包含一个表达式，返回表达式的值。

```python
f = lambda x, y: x + y
f(1, 2)  # 3
```

使用场景：`sorted()` 的 key 参数、`map()`、`filter()`、回调函数。

```python
students = [('Alice', 90), ('Bob', 80)]
sorted(students, key=lambda s: s[1])  # 按成绩排序
```

不适用场景：复杂逻辑（多行代码）、需要复用的函数（应该用 def 定义）。

---

### 13. 常用的内置函数有哪些？

| 函数 | 用途 | 示例 |
|------|------|------|
| `map(func, iterable)` | 对每个元素应用函数 | `map(str, [1,2,3])` → `['1','2','3']` |
| `filter(func, iterable)` | 过滤元素 | `filter(lambda x: x>2, [1,2,3])` → `[3]` |
| `zip(a, b)` | 并行遍历多个可迭代对象 | `zip([1,2], ['a','b'])` → `[(1,'a'),(2,'b')]` |
| `enumerate(iterable)` | 带索引遍历 | `enumerate(['a','b'])` → `[(0,'a'),(1,'b')]` |
| `sorted(iterable, key=)` | 排序（返回新列表） | `sorted([3,1,2])` → `[1,2,3]` |
| `any(iterable)` | 任一为 True 则 True | `any([0, False, 1])` → True |
| `all(iterable)` | 全部为 True 则 True | `all([1, 2, 3])` → True |
| `isinstance(obj, type)` | 类型检查 | `isinstance(1, int)` → True |

---

## 三、面向对象

### 14. Python 的面向对象特性？和 Java 的区别？

Python 支持封装、继承、多态，但实现方式和 Java 不同：
- 封装：Python 没有真正的 private，用 `_`（约定私有）和 `__`（名称修饰 name mangling）模拟
- 继承：支持多继承，Java 只能单继承
- 多态：Python 是鸭子类型（duck typing），不关心对象类型，只关心有没有对应方法。不需要像 Java 那样声明接口。

```python
class Dog:
    def speak(self):
        return "Woof"

class Cat:
    def speak(self):
        return "Meow"

def animal_speak(animal):
    return animal.speak()  # 不关心类型，只要有 speak 方法

animal_speak(Dog())  # "Woof"
animal_speak(Cat())  # "Meow"
```

---

### 15. Python 的魔术方法（双下方法）有哪些常用的？

| 方法 | 触发场景 | 说明 |
|------|---------|------|
| `__init__` | 对象初始化 | 构造方法 |
| `__str__` | `str(obj)` / `print(obj)` | 用户友好的字符串表示 |
| `__repr__` | `repr(obj)` | 开发者友好的字符串表示 |
| `__len__` | `len(obj)` | 返回长度 |
| `__getitem__` | `obj[key]` | 索引访问 |
| `__setitem__` | `obj[key] = value` | 索引赋值 |
| `__eq__` | `obj1 == obj2` | 相等比较 |
| `__lt__` | `obj1 < obj2` | 小于比较 |
| `__call__` | `obj()` | 让对象像函数一样被调用 |
| `__enter__` / `__exit__` | `with obj:` | 上下文管理器 |
| `__iter__` / `__next__` | `for x in obj` | 迭代器协议 |

---

### 16. Python 的继承机制？MRO 是什么？

Python 支持多继承。方法解析顺序（MRO, Method Resolution Order）决定了多继承时方法的查找顺序。

Python 3 使用 C3 线性化算法，可通过 `ClassName.__mro__` 或 `ClassName.mro()` 查看。

```python
class A:
    def hello(self):
        print("A")

class B(A):
    def hello(self):
        print("B")

class C(A):
    def hello(self):
        print("C")

class D(B, C):
    pass

D().hello()  # "B"（按 MRO: D -> B -> C -> A）
D.__mro__    # (D, B, C, A, object)
```

---

## 四、异常处理

### 17. Python 的异常处理机制？

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"捕获异常: {e}")
except (TypeError, ValueError) as e:
    print(f"捕获多种异常: {e}")
except Exception as e:
    print(f"兜底捕获: {e}")
else:
    print("没有异常时执行")
finally:
    print("无论如何都执行")
```

注意点：
- `except` 要捕获具体异常，不要裸 `except:`（会吞掉所有异常包括 KeyboardInterrupt）
- `else` 在没有异常时执行，和 `finally` 不同
- `finally` 无论如何都执行，常用于资源释放
- 自定义异常继承 `Exception` 类

---

### 18. 常见的异常类型有哪些？

| 异常 | 场景 |
|------|------|
| `SyntaxError` | 语法错误（代码写错了） |
| `TypeError` | 类型错误（如字符串 + 数字） |
| `ValueError` | 值错误（如 `int('abc')`） |
| `KeyError` | 字典 key 不存在 |
| `IndexError` | 列表索引越界 |
| `AttributeError` | 对象没有该属性 |
| `NameError` | 变量未定义 |
| `FileNotFoundError` | 文件不存在 |
| `ZeroDivisionError` | 除以零 |
| `ImportError` / `ModuleNotFoundError` | 导入模块失败 |
| `RecursionError` | 递归超过最大深度 |

---

## 五、并发编程

### 19. GIL（全局解释器锁）是什么？为什么有 GIL 还需要加锁？

GIL（Global Interpreter Lock）是 CPython 的一个互斥锁，确保同一时刻只有一个线程执行 Python 字节码。

为什么有 GIL：
- CPython 的内存管理（引用计数）不是线程安全的，GIL 简化了内存管理
- 历史原因，移除 GIL 会破坏大量 C 扩展

GIL 的影响：
- CPU 密集型任务：多线程无法利用多核，应使用多进程（`multiprocessing`）
- I/O 密集型任务：GIL 在 I/O 等待时会释放，多线程仍然有效

为什么还需要加锁：GIL 保护的是字节码级别的线程安全，但 `x += 1` 这种操作可能对应多条字节码（LOAD、ADD、STORE），在字节码切换时仍可能出现竞态条件。所以共享可变数据时仍需 `threading.Lock`。

---

### 20. 多线程和多进程的区别？

| 特性 | 多线程 threading | 多进程 multiprocessing |
|------|-----------------|----------------------|
| 内存 | 共享内存 | 独立内存空间 |
| GIL | 受 GIL 限制 | 不受 GIL 限制 |
| 创建开销 | 小 | 大 |
| 通信 | 共享变量（需加锁） | 队列/管道 |
| 适用场景 | I/O 密集型 | CPU 密集型 |

```python
# 多线程
import threading
t = threading.Thread(target=func, args=(arg,))
t.start()

# 多进程
from multiprocessing import Process
p = Process(target=func, args=(arg,))
p.start()
```

面试追问：Python 3 中 `concurrent.futures` 模块提供了更高级的 `ThreadPoolExecutor` 和 `ProcessPoolExecutor`，推荐使用。

---

### 21. 协程（Coroutine）是什么？和线程的区别？

协程是用户态的轻量级线程，由程序自己控制调度（非抢占式）。Python 3.5+ 使用 `async/await` 语法。

```python
import asyncio

async def fetch_data():
    print("开始获取数据")
    await asyncio.sleep(1)  # 模拟 I/O
    print("数据获取完成")
    return "data"

asyncio.run(fetch_data())
```

和线程的区别：
- 协程是单线程内的并发，没有线程切换开销
- 协程由程序员控制切换时机（遇到 `await` 主动让出）
- 没有竞态条件，不需要加锁
- 适合大量 I/O 操作（网络请求、文件读写）

---

## 六、内存管理

### 22. Python 的垃圾回收机制？

Python 采用引用计数为主，标记清除 + 分代回收为辅的垃圾回收策略。

引用计数：每个对象维护一个引用计数，引用增加时 +1，减少时 -1，计数为 0 时立即回收。
- 优点：实时性好，内存释放及时
- 缺点：无法解决循环引用

循环引用：两个对象互相引用，引用计数都不为 0，但外部已无法访问。

```python
a = []
b = []
a.append(b)
b.append(a)
del a, b  # 引用计数不为 0，但已无法访问 → 循环引用
```

标记清除：定期扫描所有对象，标记可达对象，清除不可达对象。解决循环引用。

分代回收：对象分为三代（0/1/2），新创建的对象在第 0 代，每经历一次 GC 存活的对象会被移到下一代。第 0 代 GC 最频繁，第 2 代最少。Python 默认阈值：`(700, 10, 10)`。

---

### 23. Python 的内存管理和 Java 的区别？

- Python 使用引用计数 + 分代 GC，Java 使用分代 GC（新生代复制 + 老年代标记整理）
- Python 变量是对象的引用（标签），不是存储值的容器；Java 基本类型存值，引用类型存地址
- Python 的 `del` 是删除引用（不是删除对象），对象在引用计数为 0 时才被回收
- Python 有 `__del__` 析构方法，但不推荐依赖它做资源清理（执行时机不确定），推荐用 `with` 语句

---

## 七、文件与序列化

### 24. 文件操作的 with 语句有什么好处？

```python
# 推荐写法：with 自动管理资源
with open('file.txt', 'r') as f:
    content = f.read()

# 不推荐：需要手动 close，异常时可能不会执行
f = open('file.txt', 'r')
content = f.read()
f.close()
```

`with` 语句的本质是上下文管理器（实现了 `__enter__` 和 `__exit__` 方法）。即使发生异常，`__exit__` 也会执行，保证资源被释放。

---

### 25. JSON 序列化和反序列化？

```python
import json

# 序列化（Python 对象 → JSON 字符串）
data = {"name": "Alice", "age": 25}
json_str = json.dumps(data, ensure_ascii=False, indent=2)

# 反序列化（JSON 字符串 → Python 对象）
obj = json.loads(json_str)

# 文件操作
with open('data.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False)

with open('data.json', 'r') as f:
    obj = json.load(f)
```

注意：JSON 的 key 必须是字符串，值可以是 string/number/bool/null/array/object。Python 的 `None` 对应 JSON 的 `null`，`tuple` 会被转成 `array`。

---

## 八、常用标准库

### 26. os 和 sys 模块的区别？

- `os`：操作系统相关（文件、目录、环境变量、进程）
  - `os.path.join()`、`os.path.exists()`、`os.makedirs()`
  - `os.listdir()`、`os.walk()`、`os.environ`
- `sys`：Python 解释器相关（模块搜索路径、命令行参数、标准输入输出）
  - `sys.path`、`sys.argv`、`sys.exit()`
  - `sys.stdin`、`sys.stdout`、`sys.stderr`

---

### 27. re 正则表达式常用方法？

```python
import re

text = "我的手机号是 13812345678，邮箱是 test@example.com"

# 常用方法
re.findall(r'\d{11}', text)       # ['13812345678'] 找所有匹配
re.search(r'\d{11}', text)        # 第一个匹配对象
re.match(r'\d{11}', text)         # 从头匹配（这里返回 None）
re.sub(r'\d{11}', '***', text)    # 替换
re.split(r'[,，\s]', 'a,b，c d')  # 分割
```

常用正则：
- `\d` 数字、`\w` 字母数字下划线、`\s` 空白字符
- `.` 任意字符、`*` 0次或多次、`+` 1次或多次、`?` 0次或1次
- `{n,m}` n到m次、`^` 开头、`$` 结尾
- `()` 分组、`(?:)` 非捕获分组、`(?P<name>)` 命名分组

测开面试常问：手机号、邮箱、IP 地址的正则表达式。

---

### 28. collections 模块常用的数据结构？

| 类 | 用途 | 示例 |
|----|------|------|
| `Counter` | 计数器 | `Counter('abrac')` → `{'a':2, 'b':1, 'r':1, 'c':1}` |
| `defaultdict` | 带默认值的字典 | `defaultdict(list)` 访问不存在的 key 返回 `[]` |
| `OrderedDict` | 有序字典（3.7+ dict 已有序） | 用得少了 |
| `deque` | 双端队列 | 两端 O(1) 插入/删除，适合队列/栈 |
| `namedtuple` | 命名元组 | `Point = namedtuple('Point', ['x', 'y'])` |
| `ChainMap` | 合并多个字典 | 查找时按顺序搜索多个字典 |

---

## 九、测开相关

### 29. Python 中如何处理 Excel 文件？

```python
import openpyxl  # .xlsx
wb = openpyxl.load_workbook('data.xlsx')
ws = wb.active
for row in ws.iter_rows(values_only=True):
    print(row)

import pandas  # 更强大
df = pd.read_excel('data.xlsx')
print(df.head())
```

测开场景：测试数据参数化、测试结果导出、数据对比。`openpyxl` 支持读写 `.xlsx`，`pandas` 适合数据处理和分析。

---

### 30. pytest 和 unittest 的区别？

| 特性 | pytest | unittest |
|------|--------|----------|
| 语法 | 函数式，用 `assert` | 类式，继承 `TestCase` |
| 断言 | 原生 `assert`（详细报错） | `self.assertEqual()` 等 |
| 参数化 | `@pytest.mark.parametrize` | 需要 `subTest` 或第三方库 |
| 插件 | 丰富（allure、xdist、html） | 少 |
| 发现规则 | `test_*.py` / `*_test.py` | `Test*.py` 类 |
| 夹具 | `@pytest.fixture`（更灵活） | `setUp/tearDown` |

面试加分：pytest 的 fixture 作用域（function/class/module/session）、conftest.py 共享 fixture、fixture 的 yield 实现 teardown。

---

### 31. Python 的 with 语句和上下文管理器，测开中的应用？

```python
# 自定义上下文管理器（如数据库连接）
class DBConnection:
    def __enter__(self):
        self.conn = create_connection()
        return self.conn
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()

with DBConnection() as conn:
    conn.execute("SELECT ...")
# 退出时自动关闭连接
```

测开场景：
- 数据库连接管理（测试前后自动连接/断开）
- 临时修改配置（测试前后恢复）
- 接口测试的 session 管理
- 文件操作的自动关闭
- 临时目录创建和清理（`tempfile.TemporaryDirectory()`）

---

## 十、Python 进阶

### 32. Python 的类型提示（Type Hints）有什么用？

Python 3.5+ 支持类型提示，不会影响运行时行为，但能提高代码可读性和可维护性。

```python
def greet(name: str) -> str:
    return f"Hello, {name}"

# 复杂类型
from typing import List, Dict, Optional, Tuple

def process(items: List[int], config: Optional[Dict] = None) -> Tuple[bool, str]:
    ...
```

常用类型：`List`、`Dict`、`Tuple`、`Set`、`Optional`（等价于 `Union[X, None]`）、`Any`、`Callable`。Python 3.10+ 可用 `X | None` 替代 `Optional[X]`，用 `list[int]` 替代 `List[int]`。测开场景：配合 mypy 做静态检查，减少运行时类型错误。

---

### 33. @property 装饰器有什么用？

`@property` 把方法伪装成属性访问，实现getter/setter效果，同时保持接口简洁。

```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        self._celsius = (value - 32) * 5/9

t = Temperature(100)
print(t.fahrenheit)    # 212（像属性一样访问）
t.fahrenheit = 32      # 通过属性赋值
```

本质是描述符协议的语法糖。适用场景：需要在获取/设置值时做额外处理（校验、计算、日志），但不想暴露内部实现。

---

### 34. Python 的单例模式怎么实现？

四种常见方式：

1. **模块导入**（最Pythonic）：模块本身就是单例，import 只执行一次
2. **`__new__` 方法**：重写 `__new__` 控制实例创建
3. **装饰器**：用闭包缓存实例
4. **元类**：在 `__call__` 中控制实例创建

```python
# 最推荐：模块级别
# config.py
class _Config:
    def __init__(self):
        self.debug = False
config = _Config()

# 其他文件直接 from config import config
```

测开场景：数据库连接池、配置管理、日志器。实际项目中直接用模块方式最简洁。

---

### 35. Python 3.10+ 的 match-case 语法？

结构模式匹配，类似其他语言的 switch-case，但更强大——能匹配数据结构。

```python
def handle_response(response):
    match response:
        case {"status": 200, "data": data}:
            return data
        case {"status": 404}:
            return "Not Found"
        case {"status": code} if code >= 500:
            return "Server Error"
        case _:
            return "Unknown"
```

支持匹配字典、列表、类实例，支持守卫条件（`if`）。注意：Python 3.10+ 才可用，面试中说清楚版本要求是加分项。

---

### 36. Python 的序列化方式有哪些？各自适用场景？

| 方式 | 格式 | 特点 | 场景 |
|------|------|------|------|
| `json` | 文本 | 跨语言、可读 | API交互、配置文件 |
| `pickle` | 二进制 | Python专用，可序列化几乎所有对象 | 缓存、进程间通信 |
| `yaml` | 文本 | 人类可读 | 配置文件 |
| `msgpack` | 二进制 | 高效紧凑 | 高性能RPC |
| `protobuf` | 二进制 | 需要schema，高效 | 微服务通信 |

注意：`pickle` 不安全（反序列化可执行任意代码），不要用于不可信数据。`json` 不能序列化 datetime、set 等类型，需要自定义 encoder。

---

### 37. @lru_cache 怎么用？有什么坑？

`functools.lru_cache` 是内置的函数缓存装饰器，自动缓存函数返回值，相同参数直接返回缓存结果。

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

fibonacci(100)  # 瞬间返回
fibonacci.cache_info()  # 查看命中率
fibonacci.cache_clear()  # 清除缓存
```

坑：① 参数必须是 hashable 的（不能传 list、dict）；② 有内存上限（`maxsize`），LRU 淘汰最久未使用的；③ 会持有对结果的引用，可能导致内存泄漏。Python 3.9+ 还有 `@cache`（无限大小）和 `@cached_property`。

---

### 38. 抽象类（ABC）和协议（Protocol）的区别？

| 特性 | ABC | Protocol |
|------|-----|----------|
| 检查时机 | 运行时（必须继承） | 类型检查时（结构化子类型） |
| 继承要求 | 必须显式继承 | 不需要继承 |
| 思路 | 名义类型（is-a） | 鸭子类型（looks-like） |
| Python版本 | 3.4+ | 3.8+ |

```python
from abc import ABC, abstractmethod
from typing import Protocol

# ABC方式：必须继承
class BaseTest(ABC):
    @abstractmethod
    def run(self): ...

# Protocol方式：不需要继承，有同名方法就行
class Runnable(Protocol):
    def run(self) -> None: ...

def execute(obj: Runnable):  # 任何有 run() 方法的对象都行
    obj.run()
```

Protocol 更Pythonic，适合测开场景中定义接口约束（如"任何有 `setup/teardown` 方法的类都可以当测试基类"）。

---

### 39. Python 的描述符（Descriptor）是什么？

描述符是实现了 `__get__`、`__set__`、`__delete__` 中任意一个方法的对象。它是 Python 属性访问的底层机制。

`@property`、`@classmethod`、`@staticmethod` 本质都是描述符。自定义描述符可以实现：
- 属性校验（赋值时检查类型/范围）
- 惰性计算（首次访问才计算，然后缓存）
- ORM 字段映射（Django Model 的字段就是描述符）

测开面试能说出"描述符是 property 的底层实现"就够了。

---

### 40. 相对导入和绝对导入的区别？

```python
# 绝对导入（推荐）
from mypackage.submodule import func

# 相对导入（包内使用）
from . import sibling_module        # 同级
from .. import parent_module        # 上级
from .sibling import specific_func  # 同级模块的具体函数
```

常见坑：直接运行 `python mypackage/module.py` 时相对导入会报错（`ImportError: attempted relative import with no known parent package`）。解决方式：用 `python -m mypackage.module` 运行，或者把脚本入口放在包外。

测开场景：pytest 的 `conftest.py` 经常遇到导入问题，理解包导入机制能少踩坑。

---

### 41. Python 的并发模型有哪些？怎么选？

| 模型 | 适用场景 | Python实现 |
|------|---------|-----------|
| 多线程 | I/O密集（网络请求、文件读写） | `threading` / `ThreadPoolExecutor` |
| 多进程 | CPU密集（数据处理、计算） | `multiprocessing` / `ProcessPoolExecutor` |
| 异步 | 大量I/O并发（爬虫、Web服务） | `asyncio` / `aiohttp` |
| 协程+多进程 | I/O+CPU混合 | `asyncio` + `ProcessPoolExecutor` |

选型口诀：I/O等别人用异步，CPU自己算用多进程，简单场景用多线程。测开场景：接口自动化用 `pytest-xdist`（多进程并行执行用例），批量请求用 `asyncio + aiohttp`。

---

## 相关页面

- [[测开指导/测开指导-md/基础知识/01-计算机基础]]
- [[测开指导/测开指导-md/基础知识/02-Java核心技术]]
- [[测开指导/测开指导-md/基础知识/03-测试理论与策略]]
- [[测开指导/测开指导-md/基础知识/05-手撕代码高频题]]
- [[测开指导/测开指导-md/业务面试题/Python自动化测试]]
- [[测开指导/概念/自动化测试]]
- [[测开指导/概念/简历写法]]
